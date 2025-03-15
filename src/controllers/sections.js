const { validationResult } = require('express-validator');
const Section = require('../models/Section');
const Category = require('../models/Category');
const Article = require('../models/Article');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all sections
// @route   GET /api/sections
// @access  Public
exports.getSections = asyncHandler(async (req, res, next) => {
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
  query = Section.find(JSON.parse(queryStr));

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
    query = query.sort('order');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Section.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Populate
  if (req.query.populate) {
    const popFields = req.query.populate.split(',');
    popFields.forEach(field => {
      query = query.populate(field);
    });
  } else {
    query = query.populate({
      path: 'Category',
      select: 'title slug'
    }).populate({
      path: 'Article',
      select: 'title slug images'
    });
  }

  // Executing query
  const sections = await query;

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
    count: sections.length,
    pagination,
    data: sections
  });
});

// @desc    Get single section
// @route   GET /api/sections/:id
// @access  Public
exports.getSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.id)
    .populate({
      path: 'Category',
      select: 'title slug'
    })
    .populate({
      path: 'Article',
      select: 'title slug images rating'
    });

  if (!section) {
    return next(
      new ErrorResponse(`Section not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: section
  });
});

// @desc    Create new section
// @route   POST /api/sections
// @access  Private/Admin
exports.createSection = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation error', 400, errors.array()));
  }

  // Check if category exists
  if (req.body.Category) {
    const category = await Category.findById(req.body.Category);
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.body.Category}`, 404)
      );
    }
  }

  // Check if articles exist
  if (req.body.Article && req.body.Article.length > 0) {
    for (const articleId of req.body.Article) {
      const article = await Article.findById(articleId);
      if (!article) {
        return next(
          new ErrorResponse(`Article not found with id of ${articleId}`, 404)
        );
      }
    }
  }

  const section = await Section.create(req.body);

  res.status(201).json({
    success: true,
    data: section
  });
});

// @desc    Update section
// @route   PUT /api/sections/:id
// @access  Private/Admin
exports.updateSection = asyncHandler(async (req, res, next) => {
  let section = await Section.findById(req.params.id);

  if (!section) {
    return next(
      new ErrorResponse(`Section not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if category exists if updating category
  if (req.body.Category) {
    const category = await Category.findById(req.body.Category);
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.body.Category}`, 404)
      );
    }
  }

  // Check if articles exist if updating articles
  if (req.body.Article && req.body.Article.length > 0) {
    for (const articleId of req.body.Article) {
      const article = await Article.findById(articleId);
      if (!article) {
        return next(
          new ErrorResponse(`Article not found with id of ${articleId}`, 404)
        );
      }
    }
  }

  section = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: section
  });
});

// @desc    Delete section
// @route   DELETE /api/sections/:id
// @access  Private/Admin
exports.deleteSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.id);

  if (!section) {
    return next(
      new ErrorResponse(`Section not found with id of ${req.params.id}`, 404)
    );
  }

  await Section.deleteOne({ _id: section._id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add article to section
// @route   PUT /api/sections/:id/articles
// @access  Private/Admin
exports.addArticleToSection = asyncHandler(async (req, res, next) => {
  const { articleId } = req.body;

  if (!articleId) {
    return next(new ErrorResponse('Please provide an article ID', 400));
  }

  let section = await Section.findById(req.params.id);

  if (!section) {
    return next(
      new ErrorResponse(`Section not found with id of ${req.params.id}`, 404)
    );
  }

  const article = await Article.findById(articleId);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${articleId}`, 404)
    );
  }

  // Check if article already exists in section
  if (section.Article.includes(articleId)) {
    return next(
      new ErrorResponse(`Article already exists in this section`, 400)
    );
  }

  section = await Section.findByIdAndUpdate(
    req.params.id,
    { $push: { Article: articleId } },
    { new: true }
  ).populate({
    path: 'Article',
    select: 'title slug images'
  });

  res.status(200).json({
    success: true,
    data: section
  });
});

// @desc    Remove article from section
// @route   DELETE /api/sections/:id/articles/:articleId
// @access  Private/Admin
exports.removeArticleFromSection = asyncHandler(async (req, res, next) => {
  let section = await Section.findById(req.params.id);

  if (!section) {
    return next(
      new ErrorResponse(`Section not found with id of ${req.params.id}`, 404)
    );
  }

  const article = await Article.findById(req.params.articleId);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.articleId}`, 404)
    );
  }

  // Check if article exists in section
  if (!section.Article.includes(req.params.articleId)) {
    return next(
      new ErrorResponse(`Article does not exist in this section`, 400)
    );
  }

  section = await Section.findByIdAndUpdate(
    req.params.id,
    { $pull: { Article: req.params.articleId } },
    { new: true }
  ).populate({
    path: 'Article',
    select: 'title slug images'
  });

  res.status(200).json({
    success: true,
    data: section
  });
});
