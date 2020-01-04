const express = require("express");
const exphbs = require("express-handlebars");
const hbs_sections = require("express-handlebars-sections");
const session = require("express-session");
const morgan = require('morgan');
const numeral = require("numeral");
const moment = require("moment");
const bodyParser = require("body-parser");
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true
        // cookie: {
        //     secure: true
        // }
    })
);

require("./middlewares/locals.mdw")(app);
require("./middlewares/routes.mdw")(app);

moment.updateLocale("vi", {
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

app.engine(
    "hbs",
    exphbs({
        defaultLayout: "main.hbs",
        layoutsDir: "views/layouts",
        helpers: {
            section: hbs_sections(),
            format: val => numeral(val).format("0,0"),
            formatPlus: val => numeral(val).format("+0"),
            moment: (val, yourformat) => moment(val).format(yourformat),
            relativeTime: endDay => moment(endDay).fromNow(true)
        }
    })
);
app.set("view engine", "hbs");


app.get("/shop", (req, res) => {
    res.render("shop");
});

app.get("/product", (req, res) => {
    res.render("product");
});

// app.get("/cart", (req, res) => {
//     res.render("cart");
// });

// app.use((err, req, res, next) => {
//     res.status(500).send('View error on console.');
// })

// app.use((err, req, res, next) => {
//     res.status(404).send('View error on console.');
// })

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});