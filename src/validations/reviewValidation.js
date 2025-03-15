const Joi = require('joi');

// Schema for creating a review
const createReviewSchema = {
  body: Joi.object({
    title: Joi.string().required().max(100).messages({
      'string.empty': 'Title is required',
      'string.max': 'Title cannot be more than 100 characters'
    }),
    content: Joi.string().required().messages({
      'string.empty': 'Content is required'
    }),
    excerpt: Joi.string().required().max(200).messages({
      'string.empty': 'Excerpt is required',
      'string.max': 'Excerpt cannot be more than 200 characters'
    }),
    rating: Joi.number().required().min(1).max(10).messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot be more than 10',
      'any.required': 'Rating is required'
    }),
    coverImage: Joi.string().required().messages({
      'string.empty': 'Cover image is required'
    }),
    images: Joi.array().items(Joi.string()),
    pros: Joi.array().items(Joi.string()),
    cons: Joi.array().items(Joi.string()),
    specifications: Joi.object().pattern(
      Joi.string(), 
      Joi.string()
    ),
    affiliateLink: Joi.string().allow('', null),
    category: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.empty': 'Category is required',
      'string.pattern.base': 'Category must be a valid ObjectId'
    }),
    isPublished: Joi.boolean(),
    seoTitle: Joi.string().allow('', null),
    seoDescription: Joi.string().allow('', null),
    seoKeywords: Joi.array().items(Joi.string())
  })
};

// Schema for updating a review
const updateReviewSchema = {
  params: Joi.object({
    slug: Joi.string().required().messages({
      'string.empty': 'Slug is required'
    })
  }),
  body: Joi.object({
    title: Joi.string().max(100).messages({
      'string.max': 'Title cannot be more than 100 characters'
    }),
    content: Joi.string(),
    excerpt: Joi.string().max(200).messages({
      'string.max': 'Excerpt cannot be more than 200 characters'
    }),
    rating: Joi.number().min(1).max(10).messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot be more than 10'
    }),
    coverImage: Joi.string(),
    images: Joi.array().items(Joi.string()),
    pros: Joi.array().items(Joi.string()),
    cons: Joi.array().items(Joi.string()),
    specifications: Joi.object().pattern(
      Joi.string(), 
      Joi.string()
    ),
    affiliateLink: Joi.string().allow('', null),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Category must be a valid ObjectId'
    }),
    isPublished: Joi.boolean(),
    seoTitle: Joi.string().allow('', null),
    seoDescription: Joi.string().allow('', null),
    seoKeywords: Joi.array().items(Joi.string())
  })
};

// Schema for getting a review by slug
const getReviewSchema = {
  params: Joi.object({
    slug: Joi.string().required().messages({
      'string.empty': 'Slug is required'
    })
  })
};

// Schema for filtering reviews
const getReviewsSchema = {
  query: Joi.object({
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Category must be a valid ObjectId'
    }),
    rating: Joi.number(),
    isPublished: Joi.boolean(),
    title: Joi.string(),
    select: Joi.string(),
    sort: Joi.string(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  getReviewSchema,
  getReviewsSchema
};
