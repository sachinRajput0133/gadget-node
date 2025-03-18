const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articles');
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../helpers/utils/validator');
const articleValidation = require('../helpers/utils/validations/article.validation');

// Get all articles (public)
router.get('/', articleController.getArticles);

// Get single article by slug (public)
// router.get('/slug/:slug', articleController.getArticleBySlug);

// Get single article by ID (public)
router.get('/:id', articleController.getArticleById);

// Protected routes (require authentication)
// router.use(protect);

// Create article (admin only)
router.post(
  '/',
  // authorize('admin'),
  // validateRequest(articleValidation.createArticle),
  articleController.createArticle
);

// Update article (admin only)
router.put(
  '/:id',
  authorize('admin'),
  validateRequest(articleValidation.updateArticle),
  articleController.updateArticle
);

// Delete article (admin only)
router.delete(
  '/:id',
  authorize('admin'),
  articleController.deleteArticle
);

// Toggle article status (admin only)
router.patch(
  '/:id/toggle-status',
  authorize('admin'),
  articleController.toggleArticleStatus
);

module.exports = router;
