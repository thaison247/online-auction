const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/products', async (req, res) => {

    for (const dm of res.locals.lcCategories) {
        if (dm.id_dm === +req.params.id) {
            dm.isActive = true;
        }
    }

    const rows = await productModel.allByCat(req.params.id);
    res.render('vwShop/allByCat', {
        products: rows,
        empty: rows.length === 0
    });
})

module.exports = router;