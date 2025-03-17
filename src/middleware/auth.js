const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

/**
 * Protect routes - Verifies JWT token and attaches user to request
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
   
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Set token from cookie
    token = req.cookies.token;
  }
  console.log("🚀 ~ exports.protect=asyncHandler ~ token:", token)

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route1111', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and populate with role and permissions
    req.user = await User.findById(decoded.id)
    
    // Check if user is active
    if (!req.user.isActive) {
      return next(new ErrorResponse('Your account has been deactivated', 401));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this rouasasaste', 401));
  }
});

/**
 * Grant access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ErrorResponse('Not authorized to access this routeasas', 403));
    }
    
    if (!roles.includes(req.user.role.name)) {
      return next(new ErrorResponse(`User with role ${req.user.role.name} is  rolee`, 403));
    }
    
    next();
  };
};

/**
 * Check if user has specific permission
 */
const hasPermission = (permissionCode) => {
  console.log("🚀 ~ exports.hasPermission ~ permissionCode:", permissionCode)
  return (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.permissions) {
      return next(new ErrorResponse('Not authorized to access this route hasPermission1111', 403));
    }
    
    // Super admin bypass - has all permissions
    if (req.user.role.name === 'Super Admin') {
      return next();
    }
    
    // Check if user role has the required permission
    const hasPermission = req.user.role.permissions.some(
      permission => permission.code === permissionCode
    );
    console.log("🚀 ~ return ~ hasPermission:", hasPermission)
    
    if (!hasPermission) {
      return next(new ErrorResponse(`You do not have permission to perform this action hasPermission`, 403));
    }
    
    next();
  };
};

/**
 * Check if user has any of the specified permissions
 */
const hasAnyPermission = (...permissionCodes) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.permissions) {
      return next(new ErrorResponse('Not authorized to access this route hasAnyPermission', 403));
    }
    
    // Super admin bypass - has all permissions
    if (req.user.role.name === 'Super Admin') {
      return next();
    }
    
    // Check if user role has any of the required permissions
    const hasPermission = req.user.role.permissions.some(
      permission => permissionCodes.includes(permission.code)
    );
    
    if (!hasPermission) {
      return next(new ErrorResponse(`You do not have permission to perform this action hasAnyPermission`, 403));
    }
    
    next();
  };
};
module.exports = {
  protect,
  authorize,
  hasPermission,
  hasAnyPermission
};
