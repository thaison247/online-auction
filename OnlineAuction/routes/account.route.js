const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('vwAccount/login', {
        layout: '../layouts/account.hbs'
    });
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('vwAccount/register', {
        layout: '../layouts/account.hbs'
    })
});

router.post('/register', (req, res) => {

})

module.exports = router;