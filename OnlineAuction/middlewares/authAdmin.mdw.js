module.exports = (req, res, next) => {
    if (req.session.isAuthenticatedAdmin === false)
        return res.redirect(`/account/login?retUrl=${req.originalUrl}`);

    next();
}