const express = require('express');
const db = require('../../utils/db');
const router = express.Router();
const requestModel = require('../../models/request.model')
const userModel = require('../../models/user.model');
const config = require('../../config/default');
const moment = require('moment');


router.get('/', async (req, res) => {
    var rows = await userModel.allWithoutAd();
    for (i = 0; i < rows.length; i++) {
        if (rows[i].phan_he === 2) {
            rows[i].isSeller = true;
        }
    }
    res.render('vwAdmin/userManagement', {
        users: rows,
        layout: "../layouts/admin.hbs"
    })
});

router.post('/delete/:id_user', async (req, res) => {
    var entity = {
        id_user: req.params.id_user,
        da_xoa: true
    }
    const result = await userModel.patch(entity);
    res.redirect('/admin/users');
});

router.post('/del', async (req, res) => {
    const result = await categoryModel.del(req.body.CatID);
    // console.log(result.affectedRows);
    res.redirect('/admin/categories');
})

module.exports = router;