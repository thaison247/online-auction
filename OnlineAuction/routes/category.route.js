const express = require('express');
const productModel = require('../models/product.model');
const bidModel = require('../models/bid.model');
const moment = require('moment');
const config = require('../config/default.json');

const router = express.Router();

//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/products', async (req, res) => {

    for (const dm of res.locals.lcCategories) {
        if (dm.id_dm === +req.params.id) {
            dm.isActive = true;
        }
    }

    const catId = req.params.id;
    const limit = config.paginate.limit;

    var page = req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginate.limit;

    const [total, rows] = await Promise.all([
        productModel.countByCat(catId),
        productModel.allByCatWithInfo(catId, offset)
    ]);

    // const total = await productModel.countByCat(catId);
    let nPages = Math.floor(total / limit);
    // if (page = nPages) page = page - 1;
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        })
    }

    // const rows = await productModel.pageByCat(catId, offset);
    if (page >= nPages) {
        res.render('vwShop/allByCat', {
            products: rows,
            empty: rows.length === 0,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page,
        });
    } else {
        res.render('vwShop/allByCat', {
            products: rows,
            empty: rows.length === 0,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,
        });
    }

    // const rows = await productModel.allByCatWithInfo(req.params.id);
    // res.render('vwShop/allByCat', {
    //     products: rows,
    //     empty: rows.length === 0
    // });
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
});

module.exports = router;