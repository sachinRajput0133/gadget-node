const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole
} = require('../controllers/users');

const router = express.Router();

const { protect, hasPermission } = require('../middleware/auth');

// Apply protection middleware to all routes
router.use(protect);

// User management routes
router
  .route('/')
  .get(hasPermission('users:list'), getUsers)
  .post(hasPermission('users:create'), createUser);

router
  .route('/:id')
  .get(hasPermission('users:view'), getUser)
  .put(hasPermission('users:update'), updateUser)
  .delete(hasPermission('users:delete'), deleteUser);

// Role assignment route
router
  .route('/:id/role')
  .put(hasPermission('users:manage-roles'), changeUserRole);

module.exports = router;
