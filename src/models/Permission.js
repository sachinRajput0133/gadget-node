const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var idValidator = require("mongoose-id-validator");

const myCustomLabels = {
  totalDocs: "itemCount",
  docs: "data",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  pagingCounter: "slNo",
  meta: "paginator",
};
mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Permission name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Permission description is required']
  },
  code: {
    type: String,
    required: [true, 'Permission code is required'],
    unique: true,
    trim: true
  },
  module: {
    type: String,
    required: [true, 'Module name is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

permissionSchema.plugin(mongoosePaginate);
permissionSchema.plugin(idValidator);
// Create indexes for faster queries
permissionSchema.index({ code: 1 });
permissionSchema.index({ module: 1 });

module.exports = mongoose.model('Permission', permissionSchema);
