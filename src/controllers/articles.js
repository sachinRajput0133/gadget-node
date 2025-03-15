const { validationResult } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const slugify = require('slugify');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'populate'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Article.find(JSON.parse(queryStr));

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
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Article.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Populate
  if (req.query.populate) {
    const fields = req.query.populate.split(',');
    fields.forEach(field => {
      query = query.populate(field);
    });
  } else {
    // Default populate
    query = query.populate([
      { path: 'category', select: 'name slug' },
      { path: 'section', select: 'name slug' },
      { path: 'author', select: 'name' }
    ]);
  }

  // Executing query
  const articles = await query;

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
    count: articles.length,
    pagination,
    total,
    data: articles
  });
});

// @desc    Get single article by slug
// @route   GET /api/articles/slug/:slug
// @access  Public
exports.getArticleBySlug = asyncHandler(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug })
    .populate([
      { path: 'category', select: 'name slug' },
      { path: 'section', select: 'name slug' },
      { path: 'author', select: 'name' },
      { path: 'comments' }
    ]);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Increment view count
  article.viewCount += 1;
  await article.save();

  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Get single article by ID
// @route   GET /api/articles/:id
// @access  Public
exports.getArticleById = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id)
    .populate([
      { path: 'category', select: 'name slug' },
      { path: 'section', select: 'name slug' },
      { path: 'author', select: 'name' },
      { path: 'comments' }
    ]);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Admin
exports.createArticle = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Create slug from title if not provided
  if (!req.body.slug && req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  // Create article
  const article = await Article.create(req.body);

  res.status(201).json({
    success: true,
    data: article
  });
});

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
exports.updateArticle = asyncHandler(async (req, res, next) => {
  let article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Update slug if title is changed
  if (req.body.title && req.body.title !== article.title) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  // Update article
  article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }

  // Use remove to trigger middleware
  await article.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Toggle article publish status
// @route   PATCH /api/articles/:id/toggle-status
// @access  Private/Admin
exports.toggleArticleStatus = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }

  // Toggle isPublished status
  article.isPublished = !article.isPublished;
  await article.save();

  res.status(200).json({
    success: true,
    data: article
  });
});
