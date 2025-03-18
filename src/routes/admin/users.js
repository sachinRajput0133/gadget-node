const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole
} = require('../../controllers/users');

const router = express.Router();

const { protect, hasPermission } = require('../../middleware/auth');

// Apply protection middleware to all routes
router.use(protect);

// User management routes
router.put(
  '/list',
  authentication, getUsers
);

router.post(
  '/create',
  authentication, createUser
);
router.put(
  '/:id',  authentication, updateUser
);
router.delete(
  '/:id',  authentication, deleteUser
);

// router.patch(
//   '/:id/toggle-status',
//   authentication,  toggleUserStatus
// );
router.get('/:id',authentication, getUser);
// router
//   .route('/:id')
//   .get(getUser)
//   .put(updateUser)
//   .delete(deleteUser);

// Role assignment route
// router
//   .route('/:id/role')
//   .put(hasPermission('users:manage-roles'), changeUserRole);

module.exports = router;
