const responseStatusCode = require("./responseCode");
const {
  RESPONSE_CODE,
} = require("../../../config/constants/responseCodeConstant");

exports.successResponse = (data, res) => {
  return res.status(responseStatusCode.success).json({
    code: RESPONSE_CODE.DEFAULT,
    message: res.message,
    data: data || {},
  });
};

exports.createdDocumentResponse = (data, res) => {
  return res.status(responseStatusCode.create).json({
    code: RESPONSE_CODE.DEFAULT,
    message: res.message,
    data: data || {},
  });
};

exports.updateDocumentResponse = (data, res) => {
  return res.status(responseStatusCode.success).json({
    code: RESPONSE_CODE.DEFAULT,
    message: res.message,
    data: data || {},
  });
};

exports.successListResponse = (result, res) => {
  return res.status(responseStatusCode.success).json({
    code: RESPONSE_CODE.DEFAULT,
    message: res.message,
    data: result.data || [],
    pagination: result.pagination || {},
  });
};

exports.failureResponse = (data, res) => {
  let message = data;
  if (data && data.name === "ValidationError") {
    let i = 0;
    Object.keys(data.errors).forEach((key) => {
      if (i !== 1) {
        message = data.errors[key].message;
      }
      i++;
    });
  } else if (data && data.message) {
    message = data.message;
  }
  
  return res.status(responseStatusCode.validationError).json({
    code: RESPONSE_CODE.ERROR,
    message: message,
    data: {},
  });
};

exports.badRequest = (data, res) => {
  return res.status(responseStatusCode.badRequest).json({
    code: RESPONSE_CODE.ERROR,
    message: res.message,
    data: data || {},
  });
};

exports.recordNotFound = (res) => {
  return res.status(responseStatusCode.success).json({
    code: RESPONSE_CODE.DEFAULT,
    message: res.message,
    data: {}
  });
};

exports.notFound = (err, res) => {
  return res.status(responseStatusCode.notFound).json({
    code: RESPONSE_CODE.ERROR,
    message: err,
    data: {}
  });
};

exports.inValidParam = (message, res) => {
  message = message.replace(/\"/g, "");
  res.message = message;
  return res.status(responseStatusCode.validationError).json({
    code: RESPONSE_CODE.ERROR,
    message: message,
    data: {}
  });
};

exports.unAuthorizedRequest = (message, res) => {
  return res.status(responseStatusCode.unAuthorized).json({
    code: RESPONSE_CODE.UNAUTHENTICATED,
    message: message,
    data: {}
  });
};

exports.loginSuccess = (result, res) => {
  return res.status(responseStatusCode.success).json({
    code: RESPONSE_CODE.LOGIN,
    message: res.message,
    data: result,
  });
};

exports.loginFailed = (error, res) => {
  res.message = error.message || error;
  return res.status(responseStatusCode.validationError).json({
    code: RESPONSE_CODE.ERROR,
    message: res.message,
    data: {}
  });
};

exports.passwordEmailWrong = (res) => {
  return res.status(responseStatusCode.unAuthorized).json({
    code: RESPONSE_CODE.ERROR,
    message: res.message,
    data: {}
  });
};

exports.userNotFound = (res) => {
  return res.status(responseStatusCode.validationError).json({
    code: RESPONSE_CODE.ERROR,
    message: res.message,
    data: {}
  });
};

exports.internalServerError = (res) => {
  return res.status(responseStatusCode.internalServerError).json({
    code: RESPONSE_CODE.ERROR,
    message: res.message || "Internal server error",
    data: {}
  });
};

exports.forbidden = (message, res) => {
  return res.status(responseStatusCode.forbidden).json({
    code: RESPONSE_CODE.ERROR,
    message: message,
    data: {}
  });
};

exports.duplicateRecord = (res) => {
  return res.status(responseStatusCode.duplicateRecord).json({
    code: RESPONSE_CODE.DUPLICATE,
    message: res.message,
    data: {}
  });
};
