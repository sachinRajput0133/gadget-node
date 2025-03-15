const Joi = require('joi');

// Schema for creating a comment
const createCommentSchema = {
  params: Joi.object({
    reviewSlug: Joi.string().required().messages({
      'string.empty': 'Review slug is required'
    })
  }),
  body: Joi.object({
    content: Joi.string().required().max(500).messages({
      'string.empty': 'Comment content is required',
      'string.max': 'Comment cannot be more than 500 characters'
    })
  })
};

// Schema for updating a comment
const updateCommentSchema = {
  params: Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.empty': 'Comment ID is required',
      'string.pattern.base': 'Comment ID must be a valid ObjectId'
    })
  }),
  body: Joi.object({
    content: Joi.string().required().max(500).messages({
      'string.empty': 'Comment content is required',
      'string.max': 'Comment cannot be more than 500 characters'
    }),
    isApproved: Joi.boolean()
  })
};

// Schema for getting a comment by ID
const getCommentSchema = {
  params: Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.empty': 'Comment ID is required',
      'string.pattern.base': 'Comment ID must be a valid ObjectId'
    })
  })
};

// Schema for approving a comment
const approveCommentSchema = {
  params: Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.empty': 'Comment ID is required',
      'string.pattern.base': 'Comment ID must be a valid ObjectId'
    })
  })
};

// Schema for getting comments for a review
const getCommentsSchema = {
  params: Joi.object({
    reviewSlug: Joi.string()
  }),
  query: Joi.object({
    isApproved: Joi.boolean(),
    sort: Joi.string(),
    select: Joi.string(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

module.exports = {
  createCommentSchema,
  updateCommentSchema,
  getCommentSchema,
  approveCommentSchema,
  getCommentsSchema
};
