const categoryModel = require("../models/category.model");

module.exports = function (app) {
    app.use(async (req, res, next) => {

        if (typeof req.session.isAuthenticated === "undefined") {
            req.session.isAuthenticated = false;
        }

        if (typeof req.session.authUser === "undefined") {
            req.session.authUser = {
                id_user: 0
            };
        }
        res.locals.isAuthenticated = req.session.isAuthenticated;
        res.locals.authUser = req.session.authUser;

        if (typeof req.session.number_placedBidProd === "undefined") {
            req.session.number_placedBidProd = 0;
        }

        if (typeof req.session.number_favoriteProd === "undefined") {
            req.session.number_favoriteProd = 0;
        }

        res.locals.number_placedBidProd = req.session.number_placedBidProd;
        res.locals.number_favoriteProd = req.session.number_favoriteProd;
        if (!req.session.authUser) {
            res.locals.isSeller = false;
        } else {
            res.locals.isSeller = req.session.authUser.phan_he === 1 ? false : true;
        }

        const rows = await categoryModel.allWithDetails();
        res.locals.lcCategories = rows;

        next();
    });
};