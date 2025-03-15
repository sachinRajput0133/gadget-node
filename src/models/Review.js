const mongoose = require('mongoose');
const slugify = require('slugify');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: String,
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please add an excerpt'],
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },  
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Please add a rating between 1 and 10'],
    },
    coverImage: {
      type: String,
      required: [true, 'Please add a cover image'],
    },
    images: [String],
    pros: [String],
    cons: [String],
    specifications: {
      type: Map,
      of: String,
    },
    affiliateLink: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create review slug from the title
ReviewSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

// Updated for Mongoose 7 compatibility - Using findOneAndDelete middleware
ReviewSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await this.model('Comment').deleteMany({ review: doc._id });
  }
  next();
});

// Also handle deleteOne middleware for our controller usage
ReviewSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await mongoose.model('Comment').deleteMany({ review: doc._id });
  }
  next();
});

// Reverse populate with comments
ReviewSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'review',
  justOne: false,
});

// Index for better search performance
ReviewSchema.index({ title: 'text', content: 'text', seoKeywords: 'text' });
ReviewSchema.index({ slug: 1 });
ReviewSchema.index({ category: 1 });
ReviewSchema.index({ author: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ viewCount: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
