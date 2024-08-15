const router = require('express').Router();
const { createFaculte, getAllFaculteByUniversite } = require('../controllers/faculte.controller');


router.route('/facultes').post(createFaculte);
router.route('/facultes/:idUniversite').get(getAllFaculteByUniversite);

module.exports = router; 