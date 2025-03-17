const express = require('express');
const router = express.Router();

// Import route modules
const articleRoutes = require('./articles');
const categoryRoutes = require('./categories');
const sectionRoutes = require('./sections');
const userRoutes = require('./users');
const authRoutes = require('./auth');
// const uploadRoutes = require('./uploads');
const roleRoutes = require('./roles');
const permissionRoutes = require('./permissions');

// Mount routes
router.use('/admin', require('./admin/index'));
router.use('/web', require('./web/index'))
// router.use('/articles', articleRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/sections', sectionRoutes);
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);
// router.use('/upload', uploadRoutes);
// router.use('/roles', roleRoutes);
// router.use('/permissions', permissionRoutes);

module.exports = router;
