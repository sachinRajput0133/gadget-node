const { getFilterQuery } = require('./filterQuery');
const config = require('../../../config/config')
/*
 * createDocument : create any mongoose document
 * @param  model  : mongoose model
 * @param  data   : {}
 */
const createDocument = (model, data) =>
  new Promise((resolve, reject) => {
    model.create(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

/*
 * updateDocument : update any existing mongoose document
 * @param  model  : mongoose model
 * @param id      : mongoose document's _id
 * @param data    : {}
 */
const updateDocument = (model, id, data) =>
  new Promise((resolve, reject) => {
    model.updateOne(
      { _id: id },
      data,
      {
        runValidators: true,
        context: "query",
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });

/*
 * deleteDocument : delete any existing mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 */
const deleteDocument = (model, id) =>
  new Promise((resolve, reject) => {
    model.deleteOne({ _id: id }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });



/*
 * getAllDocuments : find all the mongoose document
 * @param  model   : mongoose model
 * @param query    : {}
 * @param options  : {}
 */
const getAllDocuments = async (model, query, options) => {

  query = await getFilterQuery(query);
  return new Promise((resolve, reject) => {
    model.paginate(query, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

/*
 * getSingleDocumentById : find single mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 * @param  select : [] *optional
 */
const getSingleDocumentById = (model, id, select = []) =>
  new Promise((resolve, reject) => {
    model.findOne({ _id: id }, select, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

/*
 * findExistsData : find existing mongoose document
 * @param  model  : mongoose model
 * @params data   : {
 *                   "query":{
 *                       "and":[{"Name":"Dhiraj"},{"Salary":300}],
 *                        "or":[{"Name":"Dhiraj"},{"Salary":300}]
 *                   }
 * }
 */
const findExistsData = (model, data) => {
  // let { model } = data;
  const { query } = data;
  const { and } = query;
  const { or } = query;
  const q = {};

  if (and) {
    q.$and = [];
    for (let index = 0; index < and.length; index += 1) {
      q.$and.push(and[index]);
    }
  }
  if (or) {
    q.$or = [];
    for (let index = 0; index < or.length; index += 1) {
      q.$or.push(or[index]);
    }
  }

  return new Promise((resolve, reject) => {
    model.find(q, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
/*
 * getDocumentByAggregation : find mongoose document by aggregation
 * @param  model  : mongoose model
 * @param  query : {}
 */
const getDocumentByAggregation = (model, query) => {
  let keyInJson;
  let valuesOfAggregate;
  let valuesOfFields;
  let keysOfFields;
  let input = {};
  let finalInput = {};
  let aggregate = {};
  const array = [];
  for (const [keys, values] of Object.entries(query)) {
    for (const [key, value] of Object.entries(values)) {
      switch (keys) {
        case "group":
          keyInJson = "key" in value;
          if (keyInJson) {
            valuesOfAggregate = Object.values(value);
            valuesOfFields = Object.values(valuesOfAggregate[0]);
            keysOfFields = Object.keys(valuesOfAggregate[0]);
            for (const [nestKey, nestValue] of Object.entries(valuesOfFields)) {
              if (Array.isArray(nestValue)) {
                input._id = `$${keysOfFields[nestKey]}`;
                for (const [i, j] of Object.entries(nestValue)) {
                  finalInput[`$${key}`] = "";
                  finalInput[`$${key}`] += `$${j}`;
                  input[j] = finalInput;
                  finalInput = {};
                }
                aggregate.$group = input;
                array.push(aggregate);
              } else {
                input._id = `$${keysOfFields[nestKey]}`;
                finalInput[`$${key}`] = "";
                finalInput[`$${key}`] = `$${nestValue}`;
                input[nestValue] = finalInput;
                aggregate.$group = input;
                array.push(aggregate);
              }
            }
          }
          aggregate = {};
          finalInput = {};
          input = {};
          break;

        case "match":
          valuesOfFields = Object.values(value).flat();
          keysOfFields = Object.keys(value);
          if (Array.isArray(valuesOfFields) && valuesOfFields.length > 1) {
            finalInput.$in = valuesOfFields;
            input[keysOfFields[0]] = finalInput;
          } else {
            input[keysOfFields[0]] = valuesOfFields[0];
          }
          aggregate.$match = input;
          array.push(aggregate);
          aggregate = {};
          input = {};
          finalInput = {};
          break;

        case "project":
          valuesOfFields = Object.values(value);
          if (valuesOfFields.length === 1) {
            const projectValues = Object.values(valuesOfFields[0]).toString();
            const projectKeys = Object.keys(valuesOfFields[0]).toString();
            const projectArr = [];

            if (isNaN(projectValues)) {
              projectArr.push(`$${projectKeys}`);
              projectArr.push(`$${projectValues}`);
            } else {
              projectArr.push(`$${projectKeys}`);
              projectArr.push(projectValues);
            }
            finalInput[`$${key}`] = projectArr;
            input[projectKeys] = finalInput;
            aggregate.$project = input;
            array.push(aggregate);
          }
          aggregate = {};
          input = {};
          finalInput = {};
          break;
      }
    }
  }
  return new Promise((resolve, reject) => {
    model.aggregate(array, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

/*
 * softDeleteDocument : soft delete ( partially delete ) mongoose document
 * @param  model      : mongoose model
 * @param  id         : mongoose document's _id
 */
const softDeleteDocument = (model, id) =>
  new Promise(async (resolve, reject) => {
    const result = await getSingleDocumentById(model, id);
    result.isActive = false;
    model.updateOne({ _id: id }, result, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

/*
 * bulkInsert     : create document in bulk mongoose document
 * @param  model  : mongoose model
 * @param  data   : {}
 */
const bulkInsert = (model, data) =>
  new Promise((resolve, reject) => {
    model.insertMany(data, (err, result) => {
      if (result !== undefined && result.length > 0) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });

/*
 * bulkInsert     : update existing document in bulk mongoose document
 * @param  model  : mongoose model
 * @param  filter : {}
 * @param  data   : {}
 */
const bulkUpdate = (model, filter, data) =>
  new Promise((resolve, reject) => {
    model.updateMany(filter, data, (err, result) => {
      if (result !== undefined) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });

/*
 * countDocument : count total number of records in particular model
 * @param  model : mongoose model
 * @param where  : {}
 */
const countDocument = (model, where) =>
  new Promise((resolve, reject) => {
    model.where(where).countDocuments((err, result) => {
      if (result !== undefined) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });

/*
 * getDocumentByQuery : find document by dynamic query
 * @param  model      : mongoose model
 * @param  where      : {}
 * @param  select     : [] *optional
 */
const getDocumentByQuery = (model, where, select = []) =>
  new Promise((resolve, reject) => {
    model.findOne(where, select, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

/*
 * getDocumentByQueryWithPopulate : find document by dynamic query
 * @param  model      : mongoose model
 * @param  where      : {}
 * @param  select     : [] *optional
 */
const getDocumentByQueryWithPopulate = (model, where, populate, select = []) =>
  new Promise((resolve, reject) => {
    model
      .findOne(where, select, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      })
      .populate(populate);
  });

/*
 * findOneAndUpdateDocument : find existing document and update mongoose document
 * @param  model   : mongoose model
 * @param  filter  : {}
 * @param  data    : {}
 * @param  options : {} *optional
 */
const findOneAndUpdateDocument = (
  model,
  filter,
  data,
  options = { new: true },
  populate = []
) =>
  new Promise((resolve, reject) => {
    model
      .findOneAndUpdate(filter, data, options, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .populate(populate);
  });

/*
 * findOneAndDeleteDocument : find existing document and delete mongoose document
 * @param  model  : mongoose model
 * @param  filter  : {}
 * @param  options : {} *optional
 */
const findOneAndDeleteDocument = (model, filter, options = {}) =>
  new Promise((resolve, reject) => {
    model.findOneAndDelete(filter, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

const findUser = async (email, phone, User) => {
  const findUser = await User.findOne({
    $or: [
      {
        email: email,
      },
      {
        phone: phone,
      },
    ],
  });
  return findUser;
};

const getLastInsertedDocument = async (User) => {
  const getLastInsertedDocument = await User
    .find({})
    .sort({ _id: -1 })
    .limit(1);
  return getLastInsertedDocument;
};

/*
 * deActivateDocuments : find existing documents and deactivate(isActive) those documents
 * @param  model  : mongoose model
 * @param  ids  : array of mongoose document's id
 */
const deActivateDocuments = (ids, model) =>
  new Promise((resolve, reject) => {
    model.updateMany({ _id: { $in: ids } }, { isActive: false }, {}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

/*
  Get Document By type
*/

const getDocumentByType = async (type, Settings) => {
  try {
    const { data } = await Settings.findOne({ type: type })
    return data
  } catch (error) {
    throw new Error("Error - getDocumentByType " + error.message)
  }
}
/**
 * Copies data from a source collection to a target collection in batches.
 *
 * @param {Object} params - The parameters for the data copy operation.
 * @param {Object} params.sourceCollection - The source collection to copy data from.
 * @param {Object} params.targetCollection - The target collection to copy data to.
 * @param {Object} [params.query={}] - The query to filter documents in the source collection.
 * @returns {Promise<void>} - A promise that resolves when the data copy is complete.
 */
async function copyData(params) {
  return new Promise(async (resolve, reject) => {
    try {
      // Destructure parameters with default query as an empty object
      const { sourceCollection, targetCollection, query = {},select={} } = params;
      const batchSize = config.DB_COPY_DATA_CHUNK_SIZE; // Batch size for copying documents
      const cursor = sourceCollection.find(query).select(select).batchSize(batchSize).cursor(); // Create a cursor to iterate through source collection
      let batch = [];
      let totalCopied = 0;

      // Iterate over the documents in the source collection using a cursor
      for await (const doc of cursor) {
        batch.push(doc); // Add document to batch
        if (batch.length >= batchSize) { // If batch size is reached
          // Insert batch of documents into the target collection
          await targetCollection.insertMany(batch, { ordered: false }).catch(error => {
            logger.error(`Error in copy data` + error); // Log error if insert fails
          });
          totalCopied += batch.length;
          logger.info(`Copied ${totalCopied} documents`);
          batch = []; // Clear batch array
        }
      }

      // Insert any remaining documents in the last batch
      if (batch.length > 0) {
        await targetCollection.insertMany(batch, { ordered: false }).catch(error => {
          logger.error(`Error in copy data` + error);
        });
        totalCopied += batch.length;
        logger.info(`Copied ${totalCopied} documents`);
      }
      
      logger.info('Data copy completed');
      resolve();
    } catch (error) {
      logger.error("Error in copyData");
      logger.error(error);
      reject(new Error(error));
    }
  });
}

module.exports = {
  createDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  getSingleDocumentById,
  findExistsData,
  softDeleteDocument,
  bulkInsert,
  bulkUpdate,
  countDocument,
  getDocumentByQuery,
  getDocumentByAggregation,
  findOneAndUpdateDocument,
  findOneAndDeleteDocument,
  findUser,
  getLastInsertedDocument,
  getDocumentByQueryWithPopulate,
  deActivateDocuments,
  getDocumentByType,
  copyData
};
