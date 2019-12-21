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

    const rows = await productModel.allByCatWithInfo(req.params.id);
    res.render('vwShop/allByCat', {
        products: rows,
        empty: rows.length === 0
    });
});

router.get('/:catId/products/:proId', async (req, res) => {
    const row = await productModel.single(req.params.proId, req.params.catId);
    const cat = await productModel.catName(req.params.catId);
    const seller = await productModel.seller(req.params.proId, req.params.catId);
    const highestBidderAndPrice = await productModel.highestBidderAndPrice(req.params.proId, req.params.catId);

    if (highestBidderAndPrice.length > 0) {
        res.render('vwProduct/proDetail', {
            proInfo: row[0],
            catName: cat[0],
            seller: seller[0].ten_nguoi_ban,
            currentPrice: highestBidderAndPrice[0].currentPrice,
            highestBidder: highestBidderAndPrice[0].highestBidder,
            rcmPrice: +highestBidderAndPrice[0].currentPrice + row[0].buoc_gia,
        });
    } else {
        res.render('vwProduct/proDetail', {
            proInfo: row[0],
            catName: cat[0],
            seller: seller[0].ten_nguoi_ban,
            currentPrice: row[0].gia_khoi_diem,
            rcmPrice: +row[0].gia_khoi_diem + row[0].buoc_gia,
        });
    }
})

module.exports = router;