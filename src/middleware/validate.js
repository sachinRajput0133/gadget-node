const ErrorResponse = require('../utils/errorResponse');

// Middleware function to validate request data based on a Joi schema
const validate = (schema) => {
  return (req, res, next) => {
    // Object to hold validation results
    const validationErrors = [];

    // Validate body if schema includes body validation
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        validationErrors.push(...error.details);
      }
    }

    // Validate params if schema includes params validation
    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        validationErrors.push(...error.details);
      }
    }

    // Validate query if schema includes query validation
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        validationErrors.push(...error.details);
      }
    }

    // If validation errors exist, return them
    if (validationErrors.length > 0) {
      const formattedErrors = validationErrors.map(error => ({
        path: error.path.join('.'),
        message: error.message
      }));
      
      return next(new ErrorResponse('Validation failed', 400, formattedErrors));
    }

    next();
  };
};

module.exports = validate;
