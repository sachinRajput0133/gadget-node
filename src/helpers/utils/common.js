const moment = require('moment-timezone')


const convertPaginationResult = (data, pagination, filterCount) => {
  try {
    data = data[0];
    let totalDocs = data.metadata[0] ? data.metadata[0].total : 0;
    let docs = data.docs;
    let limit = pagination.limit;
    let totalPages = Math.ceil(totalDocs / limit) === 0 ? 1 : Math.ceil(totalDocs / limit);
    let page = Math.ceil(pagination.offset / limit) === 0 ? 1 : Math.ceil(pagination.offset / limit) + 1;
    let hasPrevPage = false;
    let prevPage = null;
    let nextPage = null;
    if (page !== 1 && page !== 0) {
      hasPrevPage = true;
      prevPage = page - 1;
    }
    let hasNextPage = false;
    if (page !== totalPages) {
      hasNextPage = true;
      nextPage = page + 1;
    }
    let responseData = {
      docs: docs,
      totalDocs: totalDocs,
      offset: pagination.offset,
      limit: limit,
      totalPages: totalPages,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevPage: prevPage,
      nextPage: nextPage,
      filterCount: filterCount || 0,
    };
    return responseData;
  } catch (error) {
    logger.error("Error - convertPaginationResult", error);
    throw error;
  }
};


const regexForSearch = (search, data) => {

  let searchData;
  const regexSearch = { $regex: search?.replace(/[^\w\.\@ ]/g, '').trim(), $options: "i" };
  switch (data) {
    case "country":
      searchData = search ? {
        $or: [
          { name: regexSearch },
          { code: regexSearch },
          { ISOCode2: regexSearch },
          { ISOCode3: regexSearch },
          { ISDCode: regexSearch },
        ],
      } : {};
      break;
    case "city":
      searchData = search ? {
        $or: [
          {
            name: regexSearch,
          },
          {
            code: regexSearch,
          }
        ],
      } : {};
      break;
    case "staff":
      searchData = search ? {
        $or: [
          {
            name: regexSearch,
          },
          {
            email: regexSearch,
          },
        ],
      } : {};
      break;
    case "state":
      searchData = search ? {
        $or: [
          {
            name: regexSearch,
          },
          {
            countryNm: regexSearch,
          },
          {
            code: regexSearch,
          },
          {
            ISOCode2: regexSearch,
          }
        ],
      } : {};
      break;
    case "company":
      searchData = search ? {
        $or: [
          {
            compNm: regexSearch,
          },
          {
            slug: regexSearch
          }
        ],
      } : {};
      break;
    case "jobs":
      searchData = search ? {
        $or: [
          {
            title: regexSearch,
          },
          {
            desc: regexSearch,
          },
        ],
      } : {};
      break;
    case "education":
      searchData = search ? {
        $or: [
          {
            qualificationNm: regexSearch,
          },
        ],
      } : {};
      break;
    case "project":
      searchData = search ? {
        $or: [
          {
            title: regexSearch,
          },
        ],
      } : {};
      break;
    case "certificate":
      searchData = search ? {
        $or: [
          {
            title: regexSearch,
          },
          {
            courseNm: regexSearch,
          },
        ],
      } : {};
      break;
    case "experience":
      searchData = search ? {
        $or: [
          {
            title: regexSearch,
          },
        ],
      } : {};
      break;
    case "master":
      searchData = search ? {
        $or: [
          {
            name: regexSearch,
          },
          {
            code: regexSearch,
          },
        ],
      } : {};
      break;
    case "role":
      searchData = search ? {
        $or: [
          {
            name: regexSearch,
          },
          {
            code: regexSearch,
          },
        ],
      } : {};
      break;
    case "candidate":
      searchData = search ? {
        $or: [
          {
            name: regexSearch,
          },
          {
            email: regexSearch,
          },
          {
            mobNo: regexSearch,
          },
        ],
      } : {};
  }
  return searchData;
}



module.exports = {
  convertPaginationResult,
  regexForSearch,
 
};
