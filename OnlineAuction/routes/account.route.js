const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const restrict = require('../middlewares/auth.mdw');
const accmdw = require('../middlewares/account.mdw');

const router = express.Router();

router.get("/login", async (req, res) => {

    res.render("vwAccount/login", {
        layout: "../layouts/account.hbs",
        // referer: req.headers.referer
    });
});

router.post("/login", async (req, res) => {
    const user = await userModel.singleByEmail(req.body.email);
    if (user.length === 0)
        return res.render("vwAccount/login", {
            layout: "../layouts/account.hbs",
            err_message: "Email không tồn tại!"
        })

    const rs = bcrypt.compareSync(req.body.password, user[0].password);
    if (rs === false)
        return res.render("vwAccount/login", {
            layout: "../layouts/account.hbs",
            err_message: "Đăng nhập không thành công!"
        });

    delete user[0].password;
    req.session.isAuthenticated = true;
    req.session.authUser = user[0];
    req.session.save();

    // console.log(req.query.retUrl);
    const url = req.query.retUrl || '/';
    res.redirect(url);

    // res.redirect(req.headers.referer);
});

router.get("/register", async (req, res) => {
    res.render("vwAccount/register", {
        layout: "../layouts/account.hbs"
    });
});

router.post("/register", async (req, res) => {
    var isExistedEmail = await userModel.singleByEmail(req.body.email);
    if (isExistedEmail.length > 0) {
        return res.render("vwAccount/register", {
            layout: "../layouts/account.hbs",
            err_message: "Thất bại! Email này đã được sử dụng!"
        });
    }
    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password, N);
    var entity = req.body;
    entity.password = hash;
    entity.phan_he = 0;

    delete entity.raw_password;

    const result = await userModel.add(entity);
    res.render("vwAccount/login", {
        layout: "../layouts/account.hbs",
        r_email: req.body.email,
        r_password: req.body.raw_password
    });
});

router.get("/profile", restrict, async (req, res) => {
    res.render("vwAccount/profile", {
        layout: "../layouts/account.hbs"
    });
});

module.exports = router;