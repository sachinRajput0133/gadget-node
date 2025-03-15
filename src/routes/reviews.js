const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');
const validate = require('../middleware/validate');
const {
  createReviewSchema,
  updateReviewSchema,
  getReviewSchema,
  getReviewsSchema
} = require('../validations/reviewValidation');

router
  .route('/')
  .get(validate(getReviewsSchema), getReviews)
  .post(protect, authorize('admin'), validate(createReviewSchema), createReview);

router
  .route('/:slug')
  .get(validate(getReviewSchema), getReview)
  .put(protect, authorize('admin'), validate(updateReviewSchema), updateReview)
  .delete(protect, authorize('admin'), deleteReview);

module.exports = router;
