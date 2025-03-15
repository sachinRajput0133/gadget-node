const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment,
  approveComment,
} = require('../controllers/comments');
const validate = require('../middleware/validate');
const {
  createCommentSchema,
  updateCommentSchema,
  getCommentSchema,
  approveCommentSchema,
  getCommentsSchema
} = require('../validations/commentValidation');

router
  .route('/')
  .get(validate(getCommentsSchema), getComments)
  .post(protect, validate(createCommentSchema), addComment);

router
  .route('/:id')
  .get(validate(getCommentSchema), getComment)
  .put(protect, validate(updateCommentSchema), updateComment)
  .delete(protect, deleteComment);

router.route('/:id/approve').put(protect, authorize('admin'), validate(approveCommentSchema), approveComment);

module.exports = router;
