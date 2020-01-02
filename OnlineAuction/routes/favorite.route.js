const express = require('express');
const favoriteModel = require('../models/favorite.model');

const router = express.Router();

router.post('/add/:catId/:proId', async (req, res) => {
    const entity = {
        id_user: res.locals.authUser.id_user,
        id_dm: req.params.catId,
        id_sp: req.params.proId,
    }
    const result = await favoriteModel.add(entity);
    res.redirect(req.headers.referer);
});

router.get('/myFavorites', async (req, res) => {
    const id = req.session.authUser.id_user;
    const productRows = await favoriteModel.allByUser(id);
    console.log(productRows);
    res.render("cart", {
        products: productRows,
        title: 'Danh sách sản phẩm yêu thích'
    });
})

module.exports = router;