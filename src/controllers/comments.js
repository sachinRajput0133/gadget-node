const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get comments for a review
// @route   GET /api/reviews/:reviewSlug/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.reviewSlug) {
    const review = await Review.findOne({ slug: req.params.reviewSlug });
    
    if (!review) {
      return next(
        new ErrorResponse(`Review not found with slug of ${req.params.reviewSlug}`, 404)
      );
    }
    
    query = Comment.find({ review: review._id });
  } else {
    query = Comment.find();
  }

  // Only show approved comments to public
  if (!req.user || req.user.role !== 'admin') {
    query = query.find({ isApproved: true });
  }

  // Add population
  query = query.populate({
    path: 'author',
    select: 'name avatar'
  });

  // Sort by creation date, newest first
  query = query.sort('-createdAt');

  const comments = await query;

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).populate({
    path: 'author',
    select: 'name avatar'
  });

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  // Only admins can see unapproved comments
  if (!comment.isApproved && (!req.user || req.user.role !== 'admin')) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Add comment
// @route   POST /api/reviews/:reviewSlug/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation error', 400, errors.array()));
  }

  const review = await Review.findOne({ slug: req.params.reviewSlug });
  
  if (!review) {
    return next(
      new ErrorResponse(`Review not found with slug of ${req.params.reviewSlug}`, 404)
    );
  }

  req.body.review = review._id;
  req.body.author = req.user.id;

  // Auto-approve comments by admins
  if (req.user.role === 'admin') {
    req.body.isApproved = true;
  }

  const comment = await Comment.create(req.body);

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is comment author or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this comment`,
        401
      )
    );
  }

  // Regular users can only update content, admins can update anything
  if (req.user.role !== 'admin') {
    req.body = { content: req.body.content };
    
    // Reset approval status if user edits their comment
    if (comment.author.toString() === req.user.id) {
      req.body.isApproved = false;
    }
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is comment author or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this comment`,
        401
      )
    );
  }

  await Comment.deleteOne({ _id: comment._id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Approve comment
// @route   PUT /api/comments/:id/approve
// @access  Private/Admin
exports.approveComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: comment
  });
});
