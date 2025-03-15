const User = require('../models/User');
const Role = require('../models/Role');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password').populate('role');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password').populate({
    path: 'role',
    populate: { path: 'permissions' }
  });
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  // Check if user with the same email already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new ErrorResponse(`User with email ${req.body.email} already exists`, 400));
  }
  
  // If no role is provided, assign the default role
  if (!req.body.role) {
    const defaultRole = await Role.findOne({ isDefault: true });
    if (defaultRole) {
      req.body.role = defaultRole._id;
    }
  }
  
  const user = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  // Check if email is being updated and if it already exists
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return next(new ErrorResponse(`User with email ${req.body.email} already exists`, 400));
    }
  }
  
  // If password is provided, handle it separately (should be hashed)
  if (req.body.password) {
    // Password hashing is handled in User model pre-save hook
    user.password = req.body.password;
    await user.save();
    
    // Remove password from update object to prevent double processing
    delete req.body.password;
  }
  
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password').populate('role');
  
  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  // Prevent deletion of the current user
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorResponse('You cannot delete your own account', 400));
  }
  
  await user.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Change user role
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  const { roleId } = req.body;
  
  if (!roleId) {
    return next(new ErrorResponse('Please provide a role ID', 400));
  }
  
  let user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  
  // Check if role exists
  const role = await Role.findById(roleId);
  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${roleId}`, 404));
  }
  
  user = await User.findByIdAndUpdate(
    req.params.id,
    { role: roleId },
    { new: true, runValidators: true }
  ).select('-password').populate('role');
  
  res.status(200).json({
    success: true,
    data: user
  });
});
