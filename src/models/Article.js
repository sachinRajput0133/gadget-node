const mongoose = require('mongoose');
const slugify = require('slugify');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    subtitle: {
      type: String,
      maxlength: [200, 'Subtitle cannot be more than 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Please add content']
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    coverImage: {
      type: String,
      default: 'default-article.jpg'
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Please add a category']
    },
    section: {
      type: mongoose.Schema.ObjectId,
      ref: 'Section'
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please add an author']
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false
    },
    featuredOrder: {
      type: Number,
      default: 0
    },
    metaTitle: {
      type: String,
      maxlength: [100, 'Meta title cannot be more than 100 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [250, 'Meta description cannot be more than 250 characters']
    },
    viewCount: {
      type: Number,
      default: 0
    },
    relatedArticles: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Article'
      }
    ],
    affiliateLinks: [
      {
        name: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        price: {
          type: Number
        },
        discount: {
          type: Number
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create article slug from the title
ArticleSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    });
  }
  next();
});

// Cascade delete comments when an article is deleted
ArticleSchema.pre('remove', async function (next) {
  await this.model('Comment').deleteMany({ article: this._id });
  next();
});

// Reverse populate with comments
ArticleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  justOne: false
});

module.exports = mongoose.model('Article', ArticleSchema);
