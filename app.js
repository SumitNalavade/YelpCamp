const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const campgroundRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");

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
app.use(express.urlencoded());
app.use(methodOverride('_method'));

app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:campgroundID/reviews", reviewRouter);

app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
});

//Display all campgrounds
app.get("/", (req, res) => {
    res.redirect("/campgrounds");
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

