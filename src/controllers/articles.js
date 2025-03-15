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
    const popFields = req.query.populate.split(',');
    popFields.forEach(field => {
      query = query.populate(field);
    });
  } else {
    query = query.populate({
      path: 'category',
      select: 'title slug'
    }).populate({
      path: 'author',
      select: 'name'
    });
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
    data: articles
  });
});

// @desc    Get single article
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug })
    .populate({
      path: 'category',
      select: 'title slug'
    })
    .populate({
      path: 'author',
      select: 'name'
    });

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Increment views
  article.views += 1;
  await article.save();

  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Admin
exports.createArticle = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation error', 400, errors.array()));
  }

  // Add author to req.body
  req.body.author = req.user.id;

  // Check if category exists
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.body.category}`, 404)
      );
    }
  }

  // Create slug from title if not provided
  if (!req.body.slug) {
    req.body.slug = slugify(req.body.title, { lower: true });
  }

  const article = await Article.create(req.body);

  res.status(201).json({
    success: true,
    data: article
  });
});

// @desc    Update article
// @route   PUT /api/articles/:slug
// @access  Private/Admin
exports.updateArticle = asyncHandler(async (req, res, next) => {
  let article = await Article.findOne({ slug: req.params.slug });

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Check if category exists if updating category
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.body.category}`, 404)
      );
    }
  }

  // Create new slug if title is updated and slug is not provided
  if (req.body.title && !req.body.slug) {
    req.body.slug = slugify(req.body.title, { lower: true });
  }

  // Update updatedAt timestamp
  req.body.updatedAt = Date.now();

  article = await Article.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Delete article
// @route   DELETE /api/articles/:slug
// @access  Private/Admin
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug });

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with slug of ${req.params.slug}`, 404)
    );
  }

  await Article.deleteOne({ _id: article._id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get articles by category
// @route   GET /api/categories/:categorySlug/articles
// @access  Public
exports.getArticlesByCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.categorySlug });

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with slug of ${req.params.categorySlug}`, 404)
    );
  }

  const articles = await Article.find({ category: category._id })
    .populate({
      path: 'category',
      select: 'title slug'
    })
    .populate({
      path: 'author',
      select: 'name'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: articles.length,
    data: articles
  });
});

// @desc    Get featured articles
// @route   GET /api/articles/featured
// @access  Public
exports.getFeaturedArticles = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 5;

  const articles = await Article.find({ status: 'published', featured: true })
    .limit(limit)
    .populate({
      path: 'category',
      select: 'title slug'
    })
    .populate({
      path: 'author',
      select: 'name'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: articles.length,
    data: articles
  });
});

// @desc    Toggle article featured status
// @route   PUT /api/articles/:slug/featured
// @access  Private/Admin
exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  let article = await Article.findOne({ slug: req.params.slug });

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with slug of ${req.params.slug}`, 404)
    );
  }

  article = await Article.findOneAndUpdate(
    { slug: req.params.slug },
    { featured: !article.featured },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Update article status
// @route   PUT /api/articles/:slug/status
// @access  Private/Admin
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['draft', 'published', 'archived'].includes(status)) {
    return next(
      new ErrorResponse('Please provide a valid status (draft, published, archived)', 400)
    );
  }

  let article = await Article.findOne({ slug: req.params.slug });

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with slug of ${req.params.slug}`, 404)
    );
  }

  article = await Article.findOneAndUpdate(
    { slug: req.params.slug },
    { status },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: article
  });
});
