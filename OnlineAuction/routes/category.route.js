const express = require('express');
const productModel = require('../models/product.model');
const bidModel = require('../models/bid.model');
const moment = require('moment');
const config = require('../config/default.json');
const favoriteModel = require('../models/favorite.model');
const userModel = require('../models/user.model');
const restrict = require("../middlewares/auth.mdw");

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
    var history = await productModel.historyBids(req.params.catId, req.params.proId);
    var isHighestBidder;
    var highestBidderName = await userModel.getName(highestBidderAndPrice[0].highestBidder);
    highestBidderAndPrice.highestBidder = highestBidderName;
    console.log(highestBidderAndPrice.highestBidder);

    var rejected;
    if (res.locals.authUser) {
        const checkRejected = await userModel.isRejected(res.locals.authUser.id_user, req.params.catId, req.params.proId);
        if (checkRejected > 0) {
            rejected = true;
        }
        if (highestBidderAndPrice[0].highestBidder === res.locals.authUser.id_user) {
            isHighestBidder = true;
            // highestBidderAndPrice.highestBidder =  'Bạn đang giữ giá cao nhất';
        }
    }

    var isUserProd;

    var inFavList;
    var id_user = 0;
    if (res.locals.authUser) {
        id_user = res.locals.authUser.id_user;
    }
    const rowProd = await productModel.checkOwner(id_user, req.params.catId, req.params.proId);
    const rowFav = await favoriteModel.count(id_user, req.params.catId, req.params.proId);

    if (+rowFav === 0) {

    } else {
        inFavList = true;
    }

    if (+rowProd > 0) {
        isUserProd = true;
    }

    var i = 0;
    history.forEach(element => {
        element.index = ++i
    });

    if (highestBidderAndPrice.length > 0) {
        res.render('vwProduct/proDetail', {
            proInfo: row[0],
            catName: cat[0],
            seller: seller[0].ten_nguoi_ban,
            currentPrice: highestBidderAndPrice.currentPrice,
            highestBidder: highestBidderAndPrice.highestBidder,
            rcmPrice: +highestBidderAndPrice[0].currentPrice + row[0].buoc_gia,
            inFavList: inFavList,
            isUserProd: isUserProd,
            historyRows: history,
            rejectedUser: rejected,
            isHighestBidder: isHighestBidder
        });
    } else {
        res.render('vwProduct/proDetail', {
            proInfo: row[0],
            catName: cat[0],
            seller: seller[0].ten_nguoi_ban,
            currentPrice: row[0].gia_khoi_diem,
            rcmPrice: +row[0].gia_khoi_diem + row[0].buoc_gia,
            inFavList: inFavList,
            isUserProd: isUserProd,
            historyRows: history,
            rejectedUser: rejected,
            isHighestBidder: isHighestBidder
        });
    }
});

router.post('/:catId/sp/:prodId/updateDes', async (req, res) => {
    var entity = req.body;
    entity.id_dm = req.params.catId;
    entity.id_sp = req.params.prodId;
    const result = await productModel.patch2(entity);
    res.redirect(req.headers.referer);
});

router.post('/:catId/products/:prodId/rejectBidder/:userId', restrict, async (req, res) => {
    var entity = {
        danh_muc: req.params.catId,
        san_pham: req.params.prodId,
        bidder: req.params.userId
    };

    const result = await userModel.addRejectUser(entity);
    res.redirect(req.headers.referer);
})

module.exports = router;