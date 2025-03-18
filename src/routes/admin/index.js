const articleRoutes = require('./articles');
const categoryRoutes = require('./categories');
const sectionRoutes = require('./sections');
const userRoutes = require('./users');
const roleRoutes = require('./roles');
const permissionRoutes = require('./permissions');
const authRoutes = require('./auth');
const router = require('express').Router();

router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/sections', sectionRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

module.exports = router;