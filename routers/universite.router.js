const router = require('express').Router();
const { createUniversite, getAllUniversite } = require('../controllers/universite.controller');

router.route('/universites').get(getAllUniversite);
router.route('/universites').post(createUniversite);

module.exports = router; 