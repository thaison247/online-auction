const categoryModel = require('../models/category.model');
const cartModel = require('../models/cart.model')

module.exports = function (app) {
    app.use(async (req, res, next) => {
        const rows = await categoryModel.allWithDetails();
        res.locals.lcCategories = rows;

        if (typeof (req.session.isAuthenticated) === 'undefined') {
            req.session.isAuthenticated = false;
        }

        if (typeof (req.session.authUser) === 'undefined') {
            req.session.authUser = {
                id_user: 0,
            };
        }

        res.locals.isAuthenticated = req.session.isAuthenticated;
        res.locals.authUser = req.session.authUser;

        const id = req.session.authUser.id_user;
        const numberInCart = await cartModel.numberOfProducts(id);
        const totalInCart = await cartModel.totalPrice(id);
        res.locals.number_in_cart = numberInCart[0].so_don_hang;
        res.locals.total_in_cart = totalInCart[0].tong_tien;
        console.log(res.locals.number_in_cart);
        next();
    })
};