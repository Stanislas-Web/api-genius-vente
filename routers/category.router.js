const router = require('express').Router();
const { createCategory, getAllCategories } = require('../controllers/category.controller');
const { isLoggedIn } = require("../middleware");

router.route('/categories').get(getAllCategories);
router.route('/categories').post(createCategory);
module.exports = router; 