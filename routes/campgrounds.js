const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campgrounds"); 

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require("../middleware"); 

router.route('/')
    .get(catchAsync(campgroundController.index)) //Find all campgrounds
    .post(validateCampground, isLoggedIn, catchAsync(campgroundController.createCampground)); //Create a new campground

// Form to create a new campground
router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgroundController.showCampground)) //View details on a campground
    .put(validateCampground, isLoggedIn, isCampgroundAuthor ,catchAsync(campgroundController.editCampround)) //Edit a campground
    .delete(isLoggedIn, isLoggedIn, catchAsync(campgroundController.deleteCampground)); //Delete a specific campround

// Form to Edit Campground
router.get("/:id/edit", isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = router