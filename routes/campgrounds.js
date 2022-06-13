const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campgrounds"); 

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require("../middleware"); 

// Find all campgrounds
router.get("/", catchAsync(campgroundController.index));

// Form to create a new campground
router.get("/new", isLoggedIn, campgroundController.renderNewForm);

// Create a new campground
router.post("/", validateCampground, isLoggedIn, catchAsync(campgroundController.createCampground));

//Display details of specific campgrounds given ID
router.get("/:id", catchAsync(campgroundController.showCampground));

// Form to Edit Campground
router.get("/:id/edit", isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.renderEditForm));

// Edit Campground
router.put("/:id", validateCampground, isLoggedIn, isCampgroundAuthor ,catchAsync(campgroundController.editCampround));

//Delete Campground
router.delete("/:id", isLoggedIn, isLoggedIn, catchAsync(campgroundController.deleteCampground));

module.exports = router