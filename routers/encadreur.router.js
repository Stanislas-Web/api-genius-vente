const router = require('express').Router();
const { sendMailEncadreur, sendMailEglise, sendPaymentEglise, callBackPayementCardSucces, callBackPayementCardError, checkApi} = require('../controllers/encadreur.controller');

router.route('/sendemail').post(sendMailEncadreur);
router.route('/sendmaileglise').post(sendMailEglise);
router.route('/paymenteglise').post(sendPaymentEglise);
router.route('/callbacksuccess/:cpm_trans_id').post(callBackPayementCardSucces);
router.route('/callbacksuccess').get(checkApi);


module.exports = router; 