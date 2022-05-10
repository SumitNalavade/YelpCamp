const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync"); //Wrapper function to handle async error
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review"); 
const Campground = require("../models/campground");
const { ReviewSchema } = require("../utils/joiValidationSchemas");

// Validate a new review or changes to an existing review
function validateReview(req, res, next) {
    const { error } = ReviewSchema.validate(req.body.review);
    if(error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else { next() }
};

//Create a new review
router.post("/", validateReview, catchAsync(async (req, res) => {
    const { campgroundID } = req.params;

    const campground = await Campground.findById(campgroundID);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();

    req.flash("success", "Created new review!");
    
    return res.redirect(`/campgrounds/${campgroundID}`);
}));

//Delete a review
router.delete("/:reviewID", catchAsync(async (req ,res) => {
    const { reviewID, campgroundID } = req.params

    await Review.findByIdAndDelete(reviewID);
    await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviews: reviewID } })

    req.flash("success", "Successfully deleted your review!");

    res.redirect(`/campgrounds/${campgroundID}`);
}));

module.exports = router