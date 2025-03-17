const express = require('express');
const {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByModule,
  bulkCreatePermissions
} = require('../../controllers/permissions');

const router = express.Router();

// Import middleware
const { protect, hasPermission } = require('../../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Routes that require specific permissions
router.route('/')
  .get(getPermissions)
  .post(createPermission);

router.route('/modules')
  .get(getPermissionsByModule);

router.route('/bulk')
  .post(bulkCreatePermissions);

router.route('/:id')
  .get(getPermission)
  .put(updatePermission)
  .delete(deletePermission);

module.exports = router;
