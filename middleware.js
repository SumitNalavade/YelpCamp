module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()) {
        req.flash("error", "you must be signed in first");
        return res.redirect("/login");
    };

    return next();
};