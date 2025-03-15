const express = require('express');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  updateRolePermissions,
  getUsersByRole
} = require('../controllers/roles');

const router = express.Router();

// Import middleware
const { protect, hasPermission } = require('../middleware/auth');

// Apply protection to all routes
// router.use(protect);

// Role management routes
router
  .route('/')
  .get(getRoles)
  .post(createRole);

router
  .route('/:id')
  .get(getRole)
  .put(hasPermission('roles:update'), updateRole)
  .delete(hasPermission('roles:delete'), deleteRole);

// Role permissions management
router
  .route('/:id/permissions')
  .post(hasPermission('role:manage-permissions'), updateRolePermissions);

// Get users with a specific role
router
  .route('/:id/users')
  .get(hasPermission('roles:view'), getUsersByRole);

module.exports = router;
