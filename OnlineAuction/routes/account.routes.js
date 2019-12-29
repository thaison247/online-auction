const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
// const restrict = require('../middlewares/auth.mdw');

const router = express.Router();

router.get("/login", async (req, res) => {
    res.render("vwAccount/login", {
        layout: "../layouts/account.hbs"
    });
});

router.post("/login", (req, res) => {});

router.get("/register", async (req, res) => {
    res.render("vwAccount/register", {
        layout: "../layouts/account.hbs"
    });
});

router.post("/register", async (req, res) => {
    console.log(req.body.email);
    var isExistedEmail = await userModel.singleByEmail(req.body.email);
    console.log(isExistedEmail);
    if (isExistedEmail.length > 0) {
        console.log(isExistedEmail);
        return res.render('vwAccount/register', {
            layout: "../layouts/account.hbs",
            err_message: 'Thất bại! Email này đã được sử dụng!'
        })
    }
    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password, N);
    var entity = req.body;
    entity.password = hash;
    entity.phan_he = 0;


    delete entity.raw_password;
    delete entity.dob;

    const result = await userModel.add(entity);
    res.render("vwAccount/login", {
        layout: "../layouts/account.hbs"
    });
});

module.exports = router;