const express = require('express');
const db = require('../../utils/db');
const router = express.Router();
const requestModel = require('../../models/request.model')
const userModel = require('../../models/user.model');
const config = require('../../config/default');
const moment = require('moment');


router.get('/', async (req, res) => {
    const rows = await requestModel.all();
    res.render('vwAdmin/request', {
        requests: rows,
        layout: "../layouts/admin.hbs"
    })
});

router.post('/accept/:id_req/:id_user', async (req, res) => {
    var entity = {
        id_req: req.params.id_req,
        da_chap_nhan: 1
    }
    const result = await requestModel.patch(entity);

    var entity2 = {
        id_user: req.params.id_user,
        phan_he: config.seller,
    }
    entity2.han_seller = moment().add(7, "days").format("YYYY-MM-DD hh:mm:ss");

    const result2 = await userModel.patch(entity2);
    res.redirect('/admin/requests');
})

router.get('/add', (req, res) => {
    res.render('vwCategories/add');
})

router.post('/add', async (req, res) => {
    // console.log(req.body);
    // const entity = {
    //   CatName: req.body.txtCatName
    // }
    const result = await categoryModel.add(req.body);
    // console.log(result.insertId);
    res.render('vwCategories/add');
})

router.get('/err', (req, res) => {

    throw new Error('error occured');

    // try {
    //   throw new Error('error occured');
    // }
    // catch (err) {
    //   console.log(err.stack);
    //   res.send('View error on console');
    // }
})

router.get('/edit/:id', async (req, res) => {
    const rows = await categoryModel.single(req.params.id);
    if (rows.length === 0) {
        throw new Error('Invalid category id');
    }
    // const c = {
    //   CatID: req.params.id,
    //   CatName: 'unknown'
    // }
    res.render('vwCategories/edit', {
        category: rows[0]
    });
})

router.post('/patch', async (req, res) => {
    const result = await categoryModel.patch(req.body);
    res.redirect('/admin/categories');
})

router.post('/del', async (req, res) => {
    const result = await categoryModel.del(req.body.CatID);
    // console.log(result.affectedRows);
    res.redirect('/admin/categories');
})

module.exports = router;