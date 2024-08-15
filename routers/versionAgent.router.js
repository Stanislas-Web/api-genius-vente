const router = require('express').Router();
const { createVersionAgent, getAllVersionAgent } = require('../controllers/versionAgent.controller');

router.route('/versionsagent').get(getAllVersionAgent);
router.route('/versionsagent').post(createVersionAgent);

module.exports = router; 