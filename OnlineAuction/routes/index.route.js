const express = require('express');
const productModel = require('../models/product.model');
const cartModel = require('../models/cart.model');
const restrict = require('../middlewares/auth.mdw');
const local = require('../middlewares/locals.mdw');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render("index");
});

router.get('/search', async (req, res) => {
    const text = req.query.tu_khoa;
    const cat = req.query.danh_muc;
    var rows = [];
    if (cat === "") {
        console.log('vafo if dau');
        rows = await productModel.searchWithAllCat(text);
    } else {
        console.log('vao else')
        rows = await productModel.searchFor(text, cat);
    }

    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: ' + cat);

    res.render('vwShop/allByCat', {
        products: rows,
        empty: rows.length === 0
    });
})

module.exports = router;