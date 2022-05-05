const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync"); //Wrapper function to handle async error
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const { CampgroundSchema, ReviewSchema } = require("./utils/joiValidationSchemas");
const Review = require("./models/review"); 

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

//Validate a new campground or changes to an existing campground
function validateCampground(req, res, next) {
    //Import the Campground Validation Schema from the utils directory
   const { error } = CampgroundSchema.validate(req.body.campground);
   if(error) {
       const message = error.details.map(el => el.message).join(",");
       throw new ExpressError(message, 400);
   } else { next() }
}

// Validate a new review or changes to an existing review
function validateReview(req, res, next) {
    const { error } = ReviewSchema.validate(req.body.review);
    if(error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else { next() }
};

app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
});

//Display all campgrounds
app.get("/", (req, res) => {
    res.redirect("/campgrounds");
});
app.get("/campgrounds", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})

    return res.render("campgrounds/index", { campgrounds });
}));

//Create new campground
app.get("/campgrounds/new", (req, res) => {
    return res.render("campgrounds/new");
});
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    
    return res.redirect(`campgrounds/${newCampground.id}`);
}));

//Display details of specific campgrounds given ID
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;

    const foundCampground = await Campground.findById(id).populate("reviews");

    return res.render("campgrounds/show", { campground: foundCampground });
}));

//Edit Campground
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {    
    const { id } = req.params;

    const foundCampground = await Campground.findById(id);

    return res.render("campgrounds/edit", { campground: foundCampground });
}));
app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true });

    return res.redirect(`/campgrounds/${id}`);
}));

//Delete Campground
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);

    return res.redirect("/campgrounds");
}));

//Create a new review
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();
    
    return res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campgrounds/:campgroundID/reviews/:reviewID", catchAsync(async (req ,res) => {
    const { reviewID, campgroundID } = req.params

    await Review.findByIdAndDelete(reviewID);
    await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviews: reviewID } })

    res.redirect(`/campgrounds/${campgroundID}`);
}));

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

