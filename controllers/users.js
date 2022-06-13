const User = require("../models/user");

// Render form to create new user
module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

// Register a new user
module.exports.register = async(req, res, next) => {    
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
};

// Render form to login
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

// Login a user
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");

    const redirectURL = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;

    return res.redirect(redirectURL);
};

// Logout a user
module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash('success', 'Goodbye!')
        return res.redirect('/campgrounds')
    });
}