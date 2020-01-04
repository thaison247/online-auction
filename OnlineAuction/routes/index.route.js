const express = require('express');
const productModel = require('../models/product.model');
const cartModel = require('../models/cart.model');
const restrict = require('../middlewares/auth.mdw');
const local = require('../middlewares/locals.mdw');
const config = require('../config/default.json');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render("index");
});

// router.get('/search', async (req, res) => {
//     const text = req.query.tu_khoa;
//     const cat = req.query.danh_muc;
//     var rows = [];
//     if (cat === "") {
//         rows = await productModel.searchWithAllCat(text);
//     } else {
//         rows = await productModel.searchFor(text, cat);
//     }

//     const limit = config.paginate.limit;

//     var page = req.query.page || 1;
//     if (page < 1) page = 1;
//     const offset = (page - 1) * config.paginate.limit;

//     const [total, rows] = await Promise.all([
//         productModel.countByCat(catId),
//         productModel.pageByCat(catId, offset)
//     ]);

//     // const total = await productModel.countByCat(catId);
//     let nPages = Math.floor(total / limit);
//     // if (page = nPages) page = page - 1;
//     if (total % limit > 0) nPages++;
//     const page_numbers = [];
//     for (i = 1; i <= nPages; i++) {
//         page_numbers.push({
//             value: i,
//             isCurrentPage: i === +page
//         })
//     }

//     // const rows = await productModel.pageByCat(catId, offset);
//     if (page >= nPages) {
//         res.render('vwShop/allByCat', {
//             products: rows,
//             empty: rows.length === 0,
//             page_numbers,
//             prev_value: +page - 1,
//             next_value: +page,
//         });
//     } else {
//         res.render('vwShop/allByCat', {
//             products: rows,
//             empty: rows.length === 0,
//             page_numbers,
//             prev_value: +page - 1,
//             next_value: +page + 1,
//         });
//     }
//     // res.render('vwShop/allByCat', {
//     //     products: rows,
//     //     empty: rows.length === 0
//     // });
// })

router.get('/search', async (req, res) => {
    const text = req.query.tu_khoa;
    const cat = req.query.danh_muc;

    // req.session.lastTextSearch = text;
    // req.session.lastCatSearch = cat;
    const limit = config.paginate.limit;
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginate.limit;

    var [total, rows] = [0, ];
    if (cat === "") {
        [total, rows] = await Promise.all([
            productModel.countSearchWithAllCat(text),
            productModel.searchWithAllCat(text, offset)
        ]);
        console.log('******************************: ' + productModel.countSearchWithAllCat(text));

    } else {
        [total, rows] = await Promise.all([
            productModel.countSearchFor(text, cat),
            productModel.searchFor(text, cat, offset)
        ]);
    }


    // const total = await productModel.countByCat(catId);
    let nPages = Math.floor(total / limit);
    // if (page = nPages) page = page - 1;
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page,
            pkey: text,
            pcatName: cat
        });


    }
    console.log('--------------------------------------------------------------------: ' + nPages);

    // const rows = await productModel.pageByCat(catId, offset);
    if (page >= nPages) {
        res.render('vwShop/searchResults', {
            products: rows,
            empty: rows.length === 0,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page,
            key: text,
            catName: cat
        });
    } else {
        res.render('vwShop/searchResults', {
            products: rows,
            empty: rows.length === 0,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,
            key: text,
            catName: cat
        });
    }
    // res.render('vwShop/allByCat', {
    //     products: rows,
    //     empty: rows.length === 0
    // });
})

module.exports = router;