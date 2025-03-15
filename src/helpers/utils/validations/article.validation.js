const Joi = require('joi');

/**
 * Article validation schemas
 */
const createArticle = {
  body: Joi.object().keys({
    title: Joi.string().required().min(3).max(200),
    slug: Joi.string().required().lowercase().trim(),
    content: Joi.string().required(),
    excerpt: Joi.string().allow('', null),
    featuredImage: Joi.string().allow('', null),
    category: Joi.string(),
    status: Joi.string().valid('draft', 'published').default('draft'),
    meta: Joi.object().keys({
      title: Joi.string().allow('', null),
      description: Joi.string().allow('', null),
      keywords: Joi.string().allow('', null)
    })
  })
};

const updateArticle = {
  params: Joi.object().keys({
    id: Joi.string().required()
  }),
  body: Joi.object().keys({
    title: Joi.string().min(3).max(200),
    slug: Joi.string().lowercase().trim(),
    content: Joi.string(),
    excerpt: Joi.string().allow('', null),
    featuredImage: Joi.string().allow('', null),
    category: Joi.string(),
    status: Joi.string().valid('draft', 'published'),
    meta: Joi.object().keys({
      title: Joi.string().allow('', null),
      description: Joi.string().allow('', null),
      keywords: Joi.string().allow('', null)
    })
  }).min(1)
};

const getArticles = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    status: Joi.string().valid('draft', 'published').allow('', null),
    sortBy: Joi.string().valid('createdAt', 'title').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

module.exports = {
  createArticle,
  updateArticle,
  getArticles
};
