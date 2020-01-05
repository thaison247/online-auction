module.exports = (req, res, next) => {
    if (req.session.isAuthenticated === false && res.locals.authUser.phan_he === 1)
        return res.redirect(`/account/login?retUrl=${req.originalUrl}`);

    next();
}