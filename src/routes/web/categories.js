const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/categories');
const validate = require('../../middleware/validate');
const {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  getCategoriesSchema
} = require('../../validations/categoryValidation');

router
  .route('/')
  .get(validate(getCategoriesSchema), getCategories)

router
  .route('/:slug')
  .get(validate(getCategorySchema), getCategory);

module.exports = router;
