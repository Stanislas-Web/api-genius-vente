const router = require('express').Router();
const { createOuvrage, getAllOuvrage } = require('../controllers/ouvrage.controller');
const { isLoggedIn } = require("../middleware");

router.route('/ouvrages').get(getAllOuvrage);
router.route('/ouvrages').post(createOuvrage);

module.exports = router; 