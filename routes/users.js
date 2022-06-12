const express = require("express");
const passport = require("passport");

const router = express.Router();


const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", catchAsync(async(req, res, next) => {    
    const { email, username, password } = req.body;

    try {
        const user = new User({ email, username,  password });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (error) => {
            if (error) { return next(error) }
            req.flash("success", "Welcome to Yelp Camp");
            return res.redirect("/campgrounds");
        });

    } catch(e) {
        req.flash("error", e.message);
        return res.redirect("register");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }) ,(req, res) => {
    req.flash("success", "Welcome back!");

    const redirectURL = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;

    return res.redirect(redirectURL);
});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash('success', 'Goodbye!')
        return res.redirect('/campgrounds')
    });
});

module.exports = router;