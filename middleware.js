const { CampgroundSchema, ReviewSchema } = require("./utils/joiValidationSchemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    };

    return next();
};

//Validate a new campground or changes to an existing campground
module.exports.validateCampground = (req, res, next) => {
    //Import the Campground Validation Schema from the utils directory
   const { error } = CampgroundSchema.validate(req.body.campground);
   if(error) {
       const message = error.details.map(el => el.message).join(",");
       throw new ExpressError(message, 400);
   } else { next() }
}

//Validate that the logged in user is the author of the campground
module.exports.isCampgroundAuthor = async(req, res, next) => {
    const { id } = req.params;
    const loggedInUser = req.user._id;

    const foundCampground = await Campground.findById(id);
    if(!foundCampground.author.equals(loggedInUser)) { 
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    };

    next();
} 

//Validate that the logged in user is the author of a review
module.exports.isReviewAuthor = async(req, res, next) => {
    const { reviewID, campgroundID } = req.params;
    const loggedInUser = req.user._id;

    const foundReview = await Review.findById(reviewID);
    if(!foundReview.author.equals(loggedInUser)) { 
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${campgroundID}`);
    };

    next();
} 

// Validate a new review or changes to an existing review
module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body.review);
    if(error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else { next() }
};
