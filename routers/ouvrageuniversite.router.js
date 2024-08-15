const router = require('express').Router();
const { createOuvrageUniversite, getAllOuvrageFaculte, getAllOuvrageFaculteById } = require('../controllers/ouvrageuniversite.controller');


router.route('/ouvragesuniversite').post(createOuvrageUniversite);
router.route('/ouvragesuniversite/:idFaculte').get(getAllOuvrageFaculteById);
router.route('/ouvragesuniversite').get(getAllOuvrageFaculte);

module.exports = router; 