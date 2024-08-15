const router = require('express').Router();
const { createOrder, getAllOrderByUserId, getAllOrder } = require('../controllers/order.controller');
const { isLoggedIn } = require("../middleware");

router.route('/orders/:userId').get(isLoggedIn,getAllOrderByUserId);
router.route('/orders').get(isLoggedIn,getAllOrder);
router.route('/orders').post(isLoggedIn,createOrder);

module.exports = router; 