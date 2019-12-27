const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');
const moment = require('moment');
const app = express();


app.use(express.static(__dirname + '/public'));

require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

moment.updateLocale('vi', {
    relativeTime: {
        future: "trong %s",
        past: "%s trước",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d ngày",
        M: "1 tháng",
        MM: "%d tháng",
        y: "1 năm",
        yy: "%d năm"
    }
});

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    helpers: {
        section: hbs_sections(),
        format: val => numeral(val).format('0,0'),
        moment: (val, yourformat) => moment(val).format(yourformat),
        relativeTime: (endDay) => moment(endDay).fromNow(true),

    }
}));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/shop', (req, res) => {
    res.render('shop');
})

app.get('/product', (req, res) => {
    res.render('product');
})

app.get('/cart', (req, res) => {
    res.render('cart');
});




// app.use((err, req, res, next) => {
//     res.status(500).send('View error on console.');
// })

// app.use((err, req, res, next) => {
//     res.status(404).send('View error on console.');
// })

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})