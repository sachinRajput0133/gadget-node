const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Private/Admin
 */
exports.getRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.find().populate('permissions', 'name code module');
  
  res.status(200).json({
    success: true,
    count: roles.length,
    data: roles
  });
});

/**
 * @desc    Get single role
 * @route   GET /api/roles/:id
 * @access  Private/Admin
 */
exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id).populate('permissions');
  
  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: role
  });
});

/**
 * @desc    Create new role
 * @route   POST /api/roles
 * @access  Private/Admin
 */
exports.createRole = asyncHandler(async (req, res, next) => {
  // Check if role with same name already exists
  const existingRole = await Role.findOne({ name: req.body.name });
  if (existingRole) {
    return next(new ErrorResponse(`Role with name ${req.body.name} already exists`, 400));
  }
  
  // If this role is set as default, clear default from any other role
  if (req.body.isDefault) {
    await Role.findOneAndUpdate(
      { isDefault: true },
      { isDefault: false }
    );
  }
  
  const role = await Role.create(req.body);
  
  res.status(201).json({
    success: true,
    data: role
  });
});

/**
 * @desc    Update role
 * @route   PUT /api/roles/:id
 * @access  Private/Admin
 */
exports.updateRole = asyncHandler(async (req, res, next) => {
  let role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }
  
  // Check for name conflict only if name is being updated
  if (req.body.name && req.body.name !== role.name) {
    const nameExists = await Role.findOne({ name: req.body.name });
    if (nameExists) {
      return next(new ErrorResponse(`Role with name ${req.body.name} already exists`, 400));
    }
  }
  
  // If this role is being set as default, clear default from any other role
  if (req.body.isDefault && !role.isDefault) {
    await Role.findOneAndUpdate(
      { isDefault: true, _id: { $ne: role._id } },
      { isDefault: false }
    );
  }
  
  role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: role
  });
});

/**
 * @desc    Delete role
 * @route   DELETE /api/roles/:id
 * @access  Private/Admin
 */
exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }
  
  // Check if this is the default role
  if (role.isDefault) {
    return next(new ErrorResponse('Cannot delete the default role', 400));
  }
  
  // Check if any users are assigned to this role
  const usersWithRole = await User.countDocuments({ role: role._id });
  
  if (usersWithRole > 0) {
    return next(new ErrorResponse(`Cannot delete role as it is assigned to ${usersWithRole} users`, 400));
  }
  
  await role.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Add permissions to role
 * @route   POST /api/roles/:id/permissions
 * @access  Private/Admin
 */
exports.updateRolePermissions = asyncHandler(async (req, res, next) => {
  const { permissionIds } = req.body;
  
  if (!permissionIds || !Array.isArray(permissionIds)) {
    return next(new ErrorResponse('Please provide an array of permission IDs', 400));
  }
  
  let role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }
  
  // Validate all permission IDs exist
  const permissions = await Permission.find({ _id: { $in: permissionIds } });
  
  if (permissions.length !== permissionIds.length) {
    return next(new ErrorResponse('One or more permission IDs are invalid', 400));
  }
  
  // Update role with new permissions
  role = await Role.findByIdAndUpdate(
    req.params.id,
    { permissions: permissionIds },
    { new: true, runValidators: true }
  ).populate('permissions');
  
  res.status(200).json({
    success: true,
    data: role
  });
});

/**
 * @desc    Get users by role
 * @route   GET /api/roles/:id/users
 * @access  Private/Admin
 */
exports.getUsersByRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${req.params.id}`, 404));
  }
  
  const users = await User.find({ role: role._id }).select('-password');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});
