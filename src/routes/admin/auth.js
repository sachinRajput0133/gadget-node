const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  getUserPermissions
} = require('../../controllers/auth');

const router = express.Router();

// Import middleware

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', authentication, getMe);
router.put('/updatedetails',authentication, updateDetails);
router.put('/updatepassword',authentication, updatePassword);
router.get('/permissions',authentication, getUserPermissions);

module.exports = router;
