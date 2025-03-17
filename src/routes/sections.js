const express = require('express');
const router = express.Router();
const sectionsController = require('../controllers/sections');
const { protect, authorize, hasPermission } = require('../middleware/auth');

// Public routes
router.get('/', sectionsController.getSections);
router.get('/:id', sectionsController.getSection);

// Protected routes (require authentication)
// router.use(protect);

// Admin routes
router.post(
  '/',
  // hasPermission('sections:create'),
  sectionsController.createSection
);

router.put(
  '/:id',
  // hasPermission('sections:update'),
  sectionsController.updateSection
);

router.delete(
  '/:id',
  // hasPermission('sections:delete'),
  sectionsController.deleteSection
);

// // Get articles by section
// router.get(
//   '/:id/articles',
//   sectionsController.getSectionArticles
// );

module.exports = router;
