const restrict = require('../middlewares/auth.mdw');
const restrictAdmin = require('../middlewares/authAdmin.mdw');


module.exports = function (app) {
    // app.use('/account', require('../routes/account.route'));
    app.use('/', require('../routes/index.route'));
    app.use('/account', require('../routes/account.route'));
    app.use('/categories', require('../routes/category.route'));
    app.use('/admin/categories', restrictAdmin, require('../routes/admin/category.route'));
    app.use('/bid', restrict, require('../routes/bid.route'));
    app.use('/favorite', restrict, require('../routes/favorite.route'));
    app.use('/admin/requests', restrictAdmin, require('../routes/admin/request.route'));
    app.use('/admin/users', restrictAdmin, require('../routes/admin/user.route'));


};