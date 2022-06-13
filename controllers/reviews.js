const Review = require("../models/review");
const Campground = require("../models/campground");

// Create a new review
module.exports.createReview = async (req, res) => {
    const author = req.user._id;
    const { campgroundID } = req.params;

    const campground = await Campground.findById(campgroundID);
    const newReview = new Review(req.body.review);
    newReview.author = author;
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();

    req.flash("success", "Created new review!");
    
    return res.redirect(`/campgrounds/${campgroundID}`);
};

// Delete a review
module.exports.deleteReview = async (req ,res) => {
    const { reviewID, campgroundID } = req.params

    await Review.findByIdAndDelete(reviewID);
    await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviews: reviewID } })

    req.flash("success", "Successfully deleted your review!");

    res.redirect(`/campgrounds/${campgroundID}`);
};