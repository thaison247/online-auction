const express = require('express');
const productModel = require('../models/product.model');
const cartModel = require('../models/cart.model');
const restrict = require('../middlewares/auth.mdw');
const local = require('../middlewares/locals.mdw');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render("index");
});

// router.get('/cart', restrict, async (req, res) => {
//     const id = req.session.authUser.id_user;
//     const cart = await cartModel.allByUser(id);
//     const total = await cartModel.totalPrice(id);
//     res.render("cart", {
//         products: cart,
//         total_price: total[0].tong_tien
//     });
// });

module.exports = router;