const { validationResult } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
const articlesService = require('../services/articles');
const ErrorResponse = require('../utils/errorResponse');
const slugify = require('slugify');
const util = require('../helpers/utils/messages');
const catchAsync = require('../helpers/utils/catchAsync');


const getArticles = catchAsync(async (req, res, next) => {
  const result = await articlesService.articleList(req.query);
  util.successResponse(result, res);
});

const getArticleBySlug = catchAsync(async (req, res, next) => {
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

const getArticleById = catchAsync(async (req, res, next) => {
  const result = await articlesService.articleDetail(req);
  util.successResponse(result, res);
});


const createArticle = catchAsync(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;
  const result = await articlesService.createArticle(req);
  util.successResponse(result, res);
});


const updateArticle = catchAsync(async (req, res, next) => {
  const result = await articlesService.updateArticle(req);
  util.successResponse(result, res);
});


const deleteArticle = catchAsync(async (req, res, next) => {
  const result = await articlesService.deleteArticle(req);
  util.successResponse(result, res);

});

// @desc    Toggle article publish status
// @route   PATCH /api/articles/:id/toggle-status
// @access  Private/Admin
const toggleArticleStatus = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }

  // Toggle isPublished status
  article.isPublished = !article.isPublished;
  await article.save();

  util.successResponse(article, res);
});

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleStatus,
  getArticles,
  getArticleBySlug,
  getArticleById
};
