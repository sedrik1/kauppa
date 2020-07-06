const express = require('express');
const { param } = require('express-validator');
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/getProducts', productsController.getProducts);

router.get('/getProduct/:id', productsController.getProduct);

router.get('/getProducts/:query',
  [ param('query').trim().escape() ],
  productsController.searchedProducts
);

module.exports = router;
