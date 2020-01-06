const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {
    // app.use('/account', require('../routes/account.route'));
    app.use('/', require('../routes/index.route'));
    app.use('/account', require('../routes/account.route'));
    app.use('/categories', require('../routes/category.route'));
    app.use('/admin/categories', restrict, require('../routes/admin/category.route'));
    app.use('/bid', restrict, require('../routes/bid.route'));
    app.use('/favorite', restrict, require('../routes/favorite.route'));
    app.use('/admin/requests', require('../routes/admin/request.route'));

};