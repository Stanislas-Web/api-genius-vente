const router = require('express').Router();
const { createNews, getAllNews } = require('../controllers/news.controller');

router.route('/news').get(getAllNews);
router.route('/news').post(createNews);

module.exports = router; 