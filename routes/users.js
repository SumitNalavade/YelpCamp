const express = require("express");
const passport = require("passport");
const userController = require("../controllers/users");

const router = express.Router();

const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

// Render form to create new user
router.get("/register", userController.renderRegister);

// Register a new user
router.post("/register", catchAsync(userController.register));

// Render form to login
router.get("/login", userController.renderLogin);

// Login a user
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }), userController.login);

// Logout a user
router.get('/logout', userController.logout);

module.exports = router;