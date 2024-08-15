const router = require('express').Router();
const { createImage, getAllImage } = require('../controllers/image.controller');

router.route('/images').get(getAllImage);
router.route('/images').post(createImage);

module.exports = router; 