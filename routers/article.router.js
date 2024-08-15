const router = require('express').Router();
const { createArticle, getAllArticles } = require('../controllers/article.controller');
const { isLoggedIn } = require("../middleware");

router.route('/articles').get(isLoggedIn,getAllArticles);
router.route('/articles').post(isLoggedIn,createArticle);

module.exports = router; 