const express = require('express');
const ordersController = require('../controllers/order');

const router = express.Router();

router.post('/placeAnOrder', ordersController.placeAnOrder);

router.post('/getOrders', ordersController.getOrders);

module.exports = router;
