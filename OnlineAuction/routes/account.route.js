const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const restrict = require("../middlewares/auth.mdw");
const bidModel = require("../models/bid.model");
const favoriteModel = require("../models/favorite.model");
const reviewModel = require("../models/review.model");
const upgradeReqModel = require("../models/upgradeReq.model");
const moment = require('moment');

const router = express.Router();

router.get("/login", async (req, res) => {
    res.render("vwAccount/login", {
        layout: "../layouts/account.hbs"
        // referer: req.headers.referer
    });
});

router.post("/login", async (req, res) => {
    const user = await userModel.singleByEmail(req.body.email);
    if (user.length === 0)
        return res.render("vwAccount/login", {
            layout: "../layouts/account.hbs",
            err_message: "Email không tồn tại!"
        });

    const rs = bcrypt.compareSync(req.body.password, user[0].password);
    if (rs === false)
        return res.render("vwAccount/login", {
            layout: "../layouts/account.hbs",
            err_message: "Đăng nhập không thành công!"
        });

    delete user[0].password;
    req.session.isAuthenticated = true;
    req.session.authUser = user[0];
    const number = await bidModel.countByUser(user[0].id_user);
    req.session.number_placedBidProd = number[0].so_sp;
    const numberFav = await favoriteModel.countByUser(user[0].id_user);
    req.session.number_favoriteProd = numberFav[0].so_sp;
    console.log("acc: " + numberFav[0].so_sp);
    req.session.save();

    // console.log(req.query.retUrl);
    const url = req.query.retUrl || "/";
    res.redirect(url);

    // res.redirect(req.headers.referer);
});

router.get("/register", async (req, res) => {
    res.render("vwAccount/register", {
        layout: "../layouts/account.hbs"
    });
});

router.post("/register", async (req, res) => {
    // console.log(req.body.captcha);
    // if (
    //     req.body.captcha === undefined ||
    //     req.body.captcha === "" ||
    //     req.body.captcha === null
    // ) {
    //     return res.json({
    //         success: false,
    //         msg: "Please select the captcha"
    //     });
    // }

    // //secret key
    // const secretKey = "6Ld3JcwUAAAAAIstNWRj_6bsX8HBBDWn_WcVmBw8";
    // //veriify url
    // const veriifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
    // //make request to verifyUrl
    // request(veriifyUrl, (err, response, body) => {
    //     body = JSON.parse(body);
    //     console.log("bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy: " + err);
    //     //if not successful
    //     if (body.success !== undefined && !body.success) {
    //         console.log(err);
    //         return res.json({
    //             success: false,
    //             msg: "Failed captcha verification"
    //         });
    //     }
    //     //if successful
    // });

    var isExistedEmail = await userModel.singleByEmail(req.body.email);
    if (isExistedEmail.length > 0) {
        return res.render("vwAccount/register", {
            layout: "../layouts/account.hbs",
            err_message: "Thất bại! Email này đã được sử dụng!"
        });
    }
    const N = 10;
    const raw_hash = bcrypt.hashSync(req.body.raw_password, N);
    var entity = req.body;
    if (req.body.raw_password === req.body.repeat_password) {
        entity.password = raw_hash;
    } else {
        return res.render("vwAccount/register", {
            layout: "../layouts/account.hbs",
            err_message: "Mật khẩu nhập lại không đúng!"
        });
    }

    entity.phan_he = 0;
    delete entity.raw_password;
    delete entity.repeat_password;

    const result = await userModel.add(entity);
    res.render("vwAccount/register", {
        layout: "../layouts/account.hbs",
        err_message: "Đăng ký thành công!"
    });
});

router.get("/profile", restrict, async (req, res) => {
    const row = await userModel.single(res.locals.authUser.id_user);
    const phan_he = row[0].phan_he === 0 ? "Bidder" : "Seller";
    res.render("vwAccount/profile", {
        user: row[0],
        phan_he: phan_he,
    });
});

router.post("/logout", (req, res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
});

router.get("/changeInfo", restrict, async (req, res) => {
    const row = await userModel.single(res.locals.authUser.id_user);
    res.render("vwAccount/changeInfo", {
        user: row[0],
    });
});

router.post("/changeInfo", async (req, res) => {
    const entity = req.body;
    entity.id_user = res.locals.authUser.id_user;
    const result = await userModel.patch(entity);
    res.redirect('/account/profile');
});

router.get("/changePassword", restrict, async (req, res) => {
    res.render("vwAccount/changePassword");
});

router.post("/changePassword", async (req, res) => {
    const user = await userModel.single(res.locals.authUser.id_user);

    const rs = bcrypt.compareSync(req.body.old_password, user[0].password);
    if (rs === false)
        return res.render("vwAccount/changePassword", {
            message: "Mật khẩu cũ không đúng!"
        });

    const N = 10;
    const raw_hash = bcrypt.hashSync(req.body.raw_password, N);
    var entity = req.body;
    entity.id_user = res.locals.authUser.id_user;
    if (req.body.raw_password === req.body.repeat_raw_password) {
        entity.password = raw_hash;
    } else {
        return res.render("vwAccount/changePassword", {
            message: "Mật khẩu nhập lại không đúng!"
        });
    }

    delete entity.raw_password;
    delete entity.old_password;
    delete entity.repeat_raw_password;

    const result = await userModel.patch(entity);
    res.render("vwAccount/changePassword", {
        message: "Đổi mật khẩu thành công!"
    });
});

router.get("/reviews", restrict, async (req, res) => {
    const rows = await reviewModel.allByUser(res.locals.authUser.id_user);
    const nGood = await reviewModel.countGoodReviews(res.locals.authUser.id_user);
    const nBad = await reviewModel.countBadReviews(res.locals.authUser.id_user);
    var so_diem = +nGood[0].diem_tot * 100 / (+rows.length);
    so_diem = Math.ceil(so_diem);


    res.render("vwAccount/reviews", {
        reviews: rows,
        so_diem: so_diem
    });
});

router.get("/upgrade", restrict, async (req, res) => {
    res.render("vwAccount/upgrade");
});

router.post("/upgrade", restrict, async (req, res) => {
    var user = res.locals.authUser.id_user;
    var time = moment().format("YYYY-MM-DD HH:mm:ss");

    if (res.locals.authUser.phan_he === 1) {
        var entity = {
            nguoi_gui: user,
            thoi_diem: time
        };


        const result = await upgradeReqModel.add(entity);
        res.render("vwAccount/upgrade", {
            message: 'Đã gửi yêu cầu nâng cấp tài khoản!'
        });
    } else {
        res.render("vwAccount/upgrade", {
            message: 'Bạn đã nâng cấp trước đó và đang là seller!'
        })
    }
});


module.exports = router;