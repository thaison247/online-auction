const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
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
})

app.use(express.static(__dirname + '/public'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})