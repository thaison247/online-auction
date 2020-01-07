const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const restrict = require("../middlewares/auth.mdw");
const bidModel = require("../models/bid.model");
const request = require('request');
const config = require('../config/default.json');
const favoriteModel = require("../models/favorite.model");
const reviewModel = require("../models/review.model");
const upgradeReqModel = require("../models/upgradeReq.model");
const productModel = require("../models/product.model");
const fs = require("fs-extra");
const moment = require("moment");

const multer = require("multer");

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let catId = req.params.catId;
            let proId = req.params.proId;
            //   let path = `.publics/imgs`;
            let path = `./public/imgs/sp/${catId}/${proId}`;
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {
            //originalname is the uploaded file's name with extn
            callback(null, file.originalname);
        }
    })
});

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
    if (user[0].phan_he === 3) {
        req.session.isAuthenticatedAdmin = true;
        return res.redirect('/admin/requests');
    }

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

    // if (
    //     req.body['g-recaptcha-response'] === undefined ||
    //     req.body['g-recaptcha-response'] === "" ||
    //     req.body['g-recaptcha-response'] === null
    // ) {
    //     return res.json({
    //         success: false,
    //         msg: "Please select the captcha"
    //     });
    // }

    // //secret key
    // const secretKey = "6Ld3JcwUAAAAAIstNWRj_6bsX8HBBDWn_WcVmBw8";
    // //veriify url
    // const veriifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    // //make request to verifyUrl
    // request(veriifyUrl, (err, response, body) => {
    //     body = JSON.parse(body);
    //     //if not successful
    //     if (body.success !== undefined && !body.success) {
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

    entity.phan_he = config.bidder;
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
    const phan_he = row[0].phan_he === config.bidder ? "Bidder" : "Seller";
    res.render("vwAccount/profile", {
        user: row[0],
        phan_he: phan_he
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
        user: row[0]
    });
});

router.post("/changeInfo", async (req, res) => {
    const entity = req.body;
    entity.id_user = res.locals.authUser.id_user;
    const result = await userModel.patch(entity);
    res.redirect("/account/profile");
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
    var so_diem = (+nGood[0].diem_tot * 100) / +rows.length;
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

    if (res.locals.authUser.phan_he === config.bidder) {
        var entity = {
            nguoi_gui: user,
        };
        const result = await upgradeReqModel.add(entity);
        res.render("vwAccount/upgrade", {
            message: "Đã gửi yêu cầu nâng cấp tài khoản!"
        });
    } else {
        res.render("vwAccount/upgrade", {
            message: "Bạn đã nâng cấp trước đó và đang là seller!"
        });
    }
});

router.get("/myProducts", restrict, async (req, res) => {
    var rows = await productModel.addedByUser(res.locals.authUser.id_user);
    rows.forEach(element => {
        var tg_het_han = element.tg_het_han;
        var now = moment();
        var diff = now.diff(tg_het_han);
        if (diff > 0) {
            element.da_het_han = true;
        } else {
            element.da_het_han = false;
        }
    });
    res.render("vwAccount/myProduct", {
        products: rows,
        total: rows.length,
        filter: 'Tất Cả'
    });
});

router.get("/myProducts/sold", restrict, async (req, res) => {
    var rows = await productModel.soldProducts(res.locals.authUser.id_user);
    for (i = 0; i < rows.length; i++) {
        rows[i].price = await bidModel.getPriceByUser(rows[i].nguoi_mua, rows[i].id_dm, rows[i].id_sp);
    }

    res.render("vwAccount/myProducts", {
        products: rows,
        total: rows.length,
        soldProd: true,
        filter: 'Đã Bán'
    });
});

router.get("/myProducts/selling", restrict, async (req, res) => {
    var rows = await productModel.sellingProducts(res.locals.authUser.id_user);
    for (i = 0; i < rows.length; i++) {
        const row = await productModel.highestBidderAndPrice(rows[i].id_dm, rows[i].id_sp);
        if (row.length > 0) {
            rows[i].curPrice = row[0].currentPrice;

            rows[i].bidder = await userModel.getName(row[0].highestBidder);
        } else {
            rows[i].curPrice = rows[i].gia_khoi_diem;
            rows[i].bidder = 'Giá khởi điểm';
            console.log(rows[i].curPrice);
        }
    }

    res.render("vwAccount/myProducts", {
        products: rows,
        total: rows.length,
        soldProd: false,
        filter: 'Đang Bán'
    });
});

router.get("/addProduct/info", restrict, async (req, res) => {
    res.render("vwAccount/addProductInfo");
});

router.post("/addProduct/info", restrict, async (req, res) => {
    var entity = req.body;
    entity.nguoi_ban = res.locals.authUser.id_user;
    entity.tg_dang = moment().format("YYYY-MM-DD hh:mm:ss");
    entity.tg_het_han = moment()
        .add(7, "days")
        .format("YYYY-MM-DD hh:mm:ss");
    const result = await productModel.add(entity);
    const catIdAdded = entity.id_dm;
    const proIdAdded = await productModel.highestProId(entity.id_dm);
    res.redirect(`/account/addProduct/img/${catIdAdded}/${proIdAdded}`);
});

router.get("/addProduct/img/:catId/:proId", restrict, async (req, res) => {
    res.render("vwAccount/addProductImg");
});

router.post("/addProduct/img/:catId/:proId", function (req, res) {
    upload.array("avatar")(req, res, err => {
        if (err) {
            res.send("error");
        }
        // const uploadPath = './public/imgs/sp/' + req.params.catId + '/'+ req.params.proId;
        const proPath = './public/imgs/sp/' + req.params.catId + '/' + req.params.proId;

        let i = 1;
        fs.readdirSync(proPath).forEach(file => {
            const extension = file.split('.').pop();
            fs.renameSync(proPath + '/' + file, proPath + '/' + i + '.' + extension);
            i++;
        });

        return res.redirect('/account/myProducts');


    });
});

module.exports = router;