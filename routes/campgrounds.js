const express = require("express");
const multer = require("multer");

const { storage } = require("../cloudinary/index");
const campgroundController = require("../controllers/campgrounds");

const router = express.Router();
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require("../middleware"); 

router.route('/')
    .get(catchAsync(campgroundController.index)) //Find all campgrounds
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgroundController.createCampground)); //Create a new campground

// Form to create a new campground
router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgroundController.showCampground)) //View details on a campground
    .put(validateCampground, isLoggedIn, isCampgroundAuthor, upload.array("image"), catchAsync(campgroundController.editCampround)) //Edit a campground
    .delete(isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.deleteCampground)); //Delete a specific campround

// Form to Edit Campground
router.get("/:id/edit", isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = router