const Joi = require('joi');

// Register validation schema
const registerSchema = {
  body: Joi.object({
    name: Joi.string().required().max(50).messages({
      'string.empty': 'Name is required',
      'string.max': 'Name cannot be more than 50 characters'
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please include a valid email'
    }),
    password: Joi.string().required().min(6).messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    })
  })
};

// Login validation schema
const loginSchema = {
  body: Joi.object({
    email: Joi.string().required().email().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please include a valid email'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  })
};

module.exports = {
  registerSchema,
  loginSchema
};
