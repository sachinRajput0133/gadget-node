const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Role = require('../models/Role');
const authService = require('../services/auth');
const util = require('../helpers/utils/messages');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, roleId } = req.body;
  console.log("🚀 ~ exports.register=asyncHandler ~ name:", name)

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorResponse('User already exists', 400));
  }

  // Verify role exists
  const role = await Role.findById(roleId);
  if (!role) {
    return next(new ErrorResponse('Invalid role specified', 400));
  }

  // Create user
  user = await User.create({
    name,
    email,
    password,
    roleId
  });

  sendTokenResponse(user, 201, res);
});


const login = asyncHandler(async (req, res, next) => {
  const result = await authService.login(req);
  util.successResponse(result, res);
});


const getMe = asyncHandler(async (req, res, next) => {
 
  const user = await User.findById(req.user.id);

  util.successResponse(user, res);
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  }).populate({
    path: 'role',
    select: 'name description'
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
 
  // Check current password
  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user permissions
// @route   GET /api/auth/permissions
// @access  Private
const getUserPermissions = asyncHandler(async (req, res, next) => {
  await req.user.populate({
    path: 'role',
    populate: {
      path: 'permissions',
      select: 'name code description module'
    }
  });

  const permissions = req.user.role ? req.user.role.permissions : [];

  res.status(200).json({
    success: true,
    data: permissions
  });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return token;

  // res
  //   .status(statusCode)
  //   .cookie('token', token, options)
  //   .json({
  //     success: true,
  //     token
  //   });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  getUserPermissions
};
