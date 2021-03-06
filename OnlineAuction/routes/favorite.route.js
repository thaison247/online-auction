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
    const numberFav = await favoriteModel.countByUser(res.locals.authUser.id_user);
    req.session.number_favoriteProd = numberFav[0].so_sp;
    // console.log(res.locals.number_favoriteProd);
    res.redirect(req.headers.referer);
});

router.get('/myFavorites', async (req, res) => {
    const id = req.session.authUser.id_user;
    const productRows = await favoriteModel.allByUser(id);
    res.render("cart", {
        products: productRows,
        title: 'Danh sách sản phẩm yêu thích'
    });
})

module.exports = router;