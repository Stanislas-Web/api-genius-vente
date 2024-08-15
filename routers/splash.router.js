const router = require('express').Router();
const { createSplash, getAllSplash } = require('../controllers/splash.controller');
const { isLoggedIn } = require("../middleware");

router.route('/splash').get(createSplash);
router.route('/splash').post(getAllSplash);

module.exports = router; 