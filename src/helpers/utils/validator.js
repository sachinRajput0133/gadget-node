const Joi = require('joi');
const messages = require('./messages');

/**
 * Validates request data against the provided schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function for validation
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(', ');
      
      res.message = errorMessage;
      return messages.inValidParam(errorMessage, res);
    }
    
    // Replace request properties with validated ones
    Object.assign(req, value);
    return next();
  };
};

/**
 * Creates an object composed of the picked object properties
 * @param {Object} object - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} Object with picked properties
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = {
  validateRequest,
  pick
};
