const mongoose = require('mongoose');
const Category = require('./Category');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true
  },
  viewAllLink: {
    type: String
  },
  Category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  Article: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
sectionSchema.index({ slug: 1 });

module.exports = mongoose.model('Section', sectionSchema);
