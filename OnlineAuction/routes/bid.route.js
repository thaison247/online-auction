const express = require('express');
const bidModel = require('../models/bid.model');
const moment = require('moment');

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
    const productRows = await bidModel.allByUser(id);
    res.render("cart", {
        products: productRows,
        title: 'Những sản phẩm bạn đã tham gia đấu giá'
    });
})

module.exports = router;