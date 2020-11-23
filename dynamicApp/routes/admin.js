const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.post('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product')
router.get('/products', adminController.getProducts);


exports.routes = router;