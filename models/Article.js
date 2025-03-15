const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  specifications: [{
    name: String,
    value: String
  }],
  pros: [String],
  cons: [String],
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  images: [{
    url: String,
    caption: String
  }],
  affiliateLinks: [{
    platform: String,
    url: String,
    price: Number
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  seoMetadata: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ status: 1, featured: 1 });

// Update the updatedAt timestamp before saving
ArticleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);
