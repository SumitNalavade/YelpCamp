const express = require("express");
const passport = require("passport");
const userController = require("../controllers/users");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

router.route("/register")
    .get(userController.renderRegister) //Render a form to register a new user
    .post(catchAsync(userController.register)); //Register a new user

router.route("/login")
    .get(userController.renderLogin) //Render a form to login a user
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }), userController.login) //Login a user

    // Logout a user
router.get('/logout', userController.logout);

module.exports = router;