const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product', 
        path: '/admin/add-product',
        activeProduct: true,
        formsCSS: true,
        productCSS: true
    });
});

router.post('/add-product', (req, res, next) => {
    products.push({title: req.body.title})
    res.redirect('/');
});

exports.routes = router;
exports.products = products;