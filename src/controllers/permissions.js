const Permission = require('../models/Permission');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get all permissions
 * @route   GET /api/permissions
 * @access  Private/Admin
 */
exports.getPermissions = asyncHandler(async (req, res, next) => {
  // Add filtering by module if query parameter is provided
  const filter = {};
  if (req.query.module) {
    filter.module = req.query.module;
  }
  
  const permissions = await Permission.find(filter).sort({ module: 1, name: 1 });
  
  res.status(200).json({
    success: true,
    count: permissions.length,
    data: permissions
  });
});

/**
 * @desc    Get permissions grouped by module
 * @route   GET /api/permissions/modules
 * @access  Private/Admin
 */
exports.getPermissionsByModule = asyncHandler(async (req, res, next) => {
  const permissions = await Permission.find().sort({ module: 1, name: 1 });
  
  // Group permissions by module
  const permissionsByModule = permissions.reduce((result, permission) => {
    const module = permission.module || 'general';
    
    if (!result[module]) {
      result[module] = [];
    }
    
    result[module].push(permission);
    return result;
  }, {});
  
  res.status(200).json({
    success: true,
    data: permissionsByModule
  });
});

/**
 * @desc    Get single permission
 * @route   GET /api/permissions/:id
 * @access  Private/Admin
 */
exports.getPermission = asyncHandler(async (req, res, next) => {
  const permission = await Permission.findById(req.params.id);
  
  if (!permission) {
    return next(new ErrorResponse(`Permission not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: permission
  });
});

/**
 * @desc    Create new permission
 * @route   POST /api/permissions
 * @access  Private/Admin
 */
exports.createPermission = asyncHandler(async (req, res, next) => {
  // Check if permission with same code already exists
  const existingPermission = await Permission.findOne({ code: req.body.code });
  if (existingPermission) {
    return next(new ErrorResponse(`Permission with code ${req.body.code} already exists`, 400));
  }
  
  const permission = await Permission.create(req.body);
  
  res.status(201).json({
    success: true,
    data: permission
  });
});

/**
 * @desc    Update permission
 * @route   PUT /api/permissions/:id
 * @access  Private/Admin
 */
exports.updatePermission = asyncHandler(async (req, res, next) => {
  let permission = await Permission.findById(req.params.id);
  
  if (!permission) {
    return next(new ErrorResponse(`Permission not found with id of ${req.params.id}`, 404));
  }
  
  // Check for code conflict only if code is being updated
  if (req.body.code && req.body.code !== permission.code) {
    const codeExists = await Permission.findOne({ code: req.body.code });
    if (codeExists) {
      return next(new ErrorResponse(`Permission with code ${req.body.code} already exists`, 400));
    }
  }
  
  permission = await Permission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: permission
  });
});

/**
 * @desc    Delete permission
 * @route   DELETE /api/permissions/:id
 * @access  Private/Admin
 */
exports.deletePermission = asyncHandler(async (req, res, next) => {
  const permission = await Permission.findById(req.params.id);
  
  if (!permission) {
    return next(new ErrorResponse(`Permission not found with id of ${req.params.id}`, 404));
  }
  
  await permission.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Bulk create permissions
 * @route   POST /api/permissions/bulk
 * @access  Private/Admin
 */
exports.bulkCreatePermissions = asyncHandler(async (req, res, next) => {
  const { permissions } = req.body;
  
  if (!permissions || !Array.isArray(permissions)) {
    return next(new ErrorResponse('Please provide an array of permissions', 400));
  }
  
  // Check for duplicate codes in the existing permissions
  const existingCodes = new Set();
  const existingPermissions = await Permission.find({
    code: { $in: permissions.map(p => p.code) }
  });
  
  existingPermissions.forEach(p => existingCodes.add(p.code));
  
  // Filter out permissions with existing codes
  const newPermissions = permissions.filter(p => !existingCodes.has(p.code));
  
  let createdPermissions = [];
  if (newPermissions.length > 0) {
    createdPermissions = await Permission.insertMany(newPermissions);
  }
  
  res.status(201).json({
    success: true,
    count: createdPermissions.length,
    duplicatesSkipped: permissions.length - newPermissions.length,
    data: createdPermissions
  });
});
