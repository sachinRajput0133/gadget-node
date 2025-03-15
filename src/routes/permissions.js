const express = require('express');
const {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByModule,
  bulkCreatePermissions
} = require('../controllers/permissions');

const router = express.Router();

// Import middleware
const { protect, hasPermission } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Routes that require specific permissions
router.route('/')
  .get(hasPermission('permissions:list'), getPermissions)
  .post(hasPermission('permissions:create'), createPermission);

router.route('/modules')
  .get(hasPermission('permissions:list'), getPermissionsByModule);

router.route('/bulk')
  .post(hasPermission('permissions:create'), bulkCreatePermissions);

router.route('/:id')
  .get(hasPermission('permissions:view'), getPermission)
  .put(hasPermission('permissions:update'), updatePermission)
  .delete(hasPermission('permissions:delete'), deletePermission);

module.exports = router;
