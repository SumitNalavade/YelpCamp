const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviews");

const catchAsync = require("../utils/catchAsync"); //Wrapper function to handle async error
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//Create a new review
router.post("/", validateReview, isLoggedIn, catchAsync(reviewController.createReview));

//Delete a review
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;