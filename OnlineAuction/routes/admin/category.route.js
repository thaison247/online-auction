const express = require('express');
const db = require('../../utils/db');
const router = express.Router();
const categoryModel = require('../../models/category.model')
router.get('/', async (req, res) => {
    try {
        // const rows = await db.load('select * from categories');
        const rows = await categoryModel.all();
        res.render('vwCategories/index', {
            categories: rows,
            empty: rows.length === 0
        });
    } catch (err) {
        console.log(err);
        res.end('View error log in console.');
    }
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