const router = require('express').Router();
const { createCategory, getAllCategories,saveManyCategories } = require('../controllers/category.controller');
const { isLoggedIn } = require("../middleware");

router.route('/categories').get(getAllCategories);
router.route('/categories').post(createCategory);
router.route('/categoriesmany').post(saveManyCategories);
module.exports = router; 