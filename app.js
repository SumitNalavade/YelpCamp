if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const campgroundRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Datbase connected");
});

const app = express();
const PORT = process.env.PORT || 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(methodOverride('_method'));
const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    return next();
});

app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:campgroundID/reviews", reviewRouter);
app.use("/", userRouter);

app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.render("home");
});

//Throw a 404 for unmatched routes
app.all("*", (req, res, next) => {
    return next(new ExpressError("Page Not Found", 404));
});

//Generic error handler
app.use((err, req, res, next) => {
    const { status = 500 } = err;

    err.message ? "" : err.message = "Something went wrong!"

    res.status(status).render("error", { err });
});

