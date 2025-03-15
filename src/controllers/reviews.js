const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Review.find(JSON.parse(queryStr)).populate({
    path: 'category',
    select: 'name slug'
  }).populate({
    path: 'author',
    select: 'name avatar'
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Review.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const reviews = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination,
    total,
    page,
    limit,
    data: reviews
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:slug
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({ slug: req.params.slug })
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .populate({
      path: 'author',
      select: 'name avatar'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name avatar'
      }
    });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Update view count
  review.viewCount += 1;
  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation error', 400, errors.array()));
  }

  // Add user to req.body
  req.body.author = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:slug
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findOne({ slug: req.params.slug });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Make sure user is review author or admin
  if (review.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this review`,
        401
      )
    );
  }

  review = await Review.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:slug
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({ slug: req.params.slug });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Make sure user is review author or admin
  if (review.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this review`,
        401
      )
    );
  }

  // Updated from remove() to deleteOne() for Mongoose 7 compatibility
  await Review.deleteOne({ _id: review._id });

  res.status(200).json({
    success: true,
    data: {}
  });
});
