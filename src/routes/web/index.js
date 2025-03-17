const articleRoutes = require('./articles');
const categoryRoutes = require('./categories');
const router = require('express').Router();

router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;