const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    icon: {
      type: String,
      default: 'default-category.png',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create category slug from the name
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Reverse populate with reviews
CategorySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'category',
  justOne: false,
});

// Index for better performance
CategorySchema.index({ slug: 1 });
CategorySchema.index({ order: 1 });
CategorySchema.index({ name: 'text' });

module.exports = mongoose.model('Category', CategorySchema);
