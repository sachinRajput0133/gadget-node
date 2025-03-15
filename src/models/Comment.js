const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please add a comment'],
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
    review: {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better performance
CommentSchema.index({ review: 1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
