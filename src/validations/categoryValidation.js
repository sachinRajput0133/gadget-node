const Joi = require('joi');

// Schema for creating a category
const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().required().max(50).messages({
      'string.empty': 'Name is required',
      'string.max': 'Name cannot be more than 50 characters'
    }),
    description: Joi.string().max(500).allow('', null).messages({
      'string.max': 'Description cannot be more than 500 characters'
    }),
    icon: Joi.string().allow('', null),
    isActive: Joi.boolean(),
    order: Joi.number().integer()
  })
};

// Schema for updating a category
const updateCategorySchema = {
  params: Joi.object({
    slug: Joi.string().required().messages({
      'string.empty': 'Slug is required'
    })
  }),
  body: Joi.object({
    name: Joi.string().max(50).messages({
      'string.max': 'Name cannot be more than 50 characters'
    }),
    description: Joi.string().max(500).allow('', null).messages({
      'string.max': 'Description cannot be more than 500 characters'
    }),
    icon: Joi.string().allow('', null),
    isActive: Joi.boolean(),
    order: Joi.number().integer()
  })
};

// Schema for getting a category by slug
const getCategorySchema = {
  params: Joi.object({
    slug: Joi.string().required().messages({
      'string.empty': 'Slug is required'
    })
  })
};

// Schema for filtering categories
const getCategoriesSchema = {
  query: Joi.object({
    name: Joi.string(),
    isActive: Joi.boolean(),
    select: Joi.string(),
    sort: Joi.string(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  getCategoriesSchema
};
