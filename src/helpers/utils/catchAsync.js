const {
  RESPONSE_CODE,
} = require("../../../config/constants/responseCodeConstant");
const responseCode = require("./responseCode");
const logger = require("./logger");

/**
 * Higher-order function to wrap route handlers for error handling
 * Eliminates the need for try-catch blocks in async controllers
 * @param {Function} fn - The async controller function to wrap
 * @returns {Function} Middleware function with error handling
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(err.message);
    res.status(responseCode.internalServerError).json({
      code: RESPONSE_CODE.ERROR,
      message: err.message,
      data: {},
    });
  });
};

module.exports = catchAsync;
