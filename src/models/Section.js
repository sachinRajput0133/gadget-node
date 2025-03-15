const mongoose = require('mongoose');
const slugify = require('slugify');

const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a section name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    metaTitle: {
      type: String,
      maxlength: [100, 'Meta title cannot be more than 100 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [250, 'Meta description cannot be more than 250 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create section slug from the name
SectionSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true
    });
  }
  next();
});

// Reverse populate with articles
SectionSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'section',
  justOne: false
});

module.exports = mongoose.model('Section', SectionSchema);
