const router = require('express').Router();
const { createVersion, getAllVersion } = require('../controllers/version.controller');

router.route('/versions').get(getAllVersion);
router.route('/versions').post(createVersion);

module.exports = router; 