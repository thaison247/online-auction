const express = require('express');
const bidModel = require('../models/bid.model');
const moment = require('moment');
const productModel = require('../models/product.model');

const router = express.Router();

router.post('/place/:catId/:proId', async (req, res) => {
    const currentTime = moment().format('YYYY-MM-DD hh:mm:ss');
    const entity = {
        so_tien: req.body.gia_tien,
        bidder: res.locals.authUser.id_user,
        id_dm: req.params.catId,
        id_sp: req.params.proId,
        thoi_diem: currentTime,
    }
    const result = await bidModel.add(entity);
    res.redirect(req.headers.referer);
});

router.get('/havePlaced', async (req, res) => {
    const id = req.session.authUser.id_user;
    var productRows = await bidModel.allByUser(id);

    for (i = 0; i < productRows.length; i++) {
        var row = await productModel.highestBidderAndPrice(productRows[i].id_dm, productRows[i].id_sp);

        if (row.length > 0) {
            if (row[0].highestBidder === id) {
                productRows[i].myPrice = true;
            }
        }
    }

    res.render("cart", {
        products: productRows,
        title: 'Những sản phẩm đang tham gia đấu giá',
    });
});

router.get('/wonList', async (req, res) => {
    const id = req.session.authUser.id_user;
    var productRows = await bidModel.wonList(id);


    res.render("cart", {
        products: productRows,
        title: 'Những sản phẩm đã thắng',
        won: true
    });
});

router.get('/reviewSeller/:sellerId', async (req, res) => {
    res.render('review');
})

module.exports = router;