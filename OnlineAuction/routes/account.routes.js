const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
// const restrict = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/login', async (req, res) => {
    res.render('vwAccount/login', {
        layout: '../layouts/account.hbs'
    });
})

router.post('/login', (req, res) => {

})

router.get('/register', async (req, res) => {
    res.render('vwAccount/register', {
        layout: '../layouts/account.hbs'
    })
});

router.post('/register', async (req, res) => {
    const N = 10;
    const hash = bcrypt.hashSync(req.body.raw_password, N);

    const entity = req.body;
    entity.password = hash;
    entity.phan_he = 0;
    // entity.f_DOB = dob;

    delete entity.raw_password;
    delete entity.dob;

    const result = await userModel.add(entity);
    res.render('vwAccount/register');
})

module.exports = router;