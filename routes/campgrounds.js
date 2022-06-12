const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { CampgroundSchema } = require("../utils/joiValidationSchemas"); 
const { isLoggedIn } = require("../middleware"); 

//Validate a new campground or changes to an existing campground
function validateCampground(req, res, next) {
    //Import the Campground Validation Schema from the utils directory
   const { error } = CampgroundSchema.validate(req.body.campground);
   if(error) {
       const message = error.details.map(el => el.message).join(",");
       throw new ExpressError(message, 400);
   } else { next() }
}

router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})

    return res.render("campgrounds/index", { campgrounds });
}));

//Create new campground
router.get("/new", isLoggedIn, (req, res) => {
    return res.render("campgrounds/new");
});
router.post("/", validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    
    req.flash("success", "Successfully made a new campground!");

    return res.redirect(`campgrounds/${newCampground.id}`);
}));

//Display details of specific campgrounds given ID
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;

    const foundCampground = await Campground.findById(id).populate("reviews");

    if(!foundCampground) { 
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }

    return res.render("campgrounds/show", { campground: foundCampground });
}));

//Edit Campground
router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {    
    const { id } = req.params;

    const foundCampground = await Campground.findById(id);

    if(!foundCampground) { 
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }

    return res.render("campgrounds/edit", { campground: foundCampground });
}));
router.put("/:id", validateCampground, isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true });

    req.flash("success", "Successfully updated campground!")

    return res.redirect(`/campgrounds/${id}`);
}));

//Delete Campground
router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfuly deleted campground!");

    return res.redirect("/campgrounds");
}));

module.exports = router