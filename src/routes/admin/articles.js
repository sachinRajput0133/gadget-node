const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/articles');
const { validateRequest } = require('../../helpers/utils/validator');
const articleValidation = require('../../helpers/utils/validations/article.validation');

// Get all articles (public)
router.get('/',authentication, articleController.getArticles);
router.get('/slug/:slug', articleController.getArticleBySlug);
router.get('/:id',authentication, articleController.getArticleById);

router.post(
  '/',
  authentication,
  // validateRequest(articleValidation.createArticle),
  articleController.createArticle
);

// Update article (admin only)
router.put(
  '/:id',
  authentication,  articleController.updateArticle
);

// Delete article (admin only)
router.delete(
  '/:id',
  authentication,  articleController.deleteArticle
);

// Toggle article status (admin only)
router.patch(
  '/:id/toggle-status',
  authentication,  articleController.toggleArticleStatus
);

module.exports = router;
