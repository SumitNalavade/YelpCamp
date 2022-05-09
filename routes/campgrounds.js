const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { CampgroundSchema } = require("../utils/joiValidationSchemas");

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
router.get("/new", (req, res) => {
    return res.render("campgrounds/new");
});
router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    
    return res.redirect(`campgrounds/${newCampground.id}`);
}));

//Display details of specific campgrounds given ID
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;

    const foundCampground = await Campground.findById(id).populate("reviews");

    return res.render("campgrounds/show", { campground: foundCampground });
}));

//Edit Campground
router.get("/:id/edit", catchAsync(async (req, res) => {    
    const { id } = req.params;

    const foundCampground = await Campground.findById(id);

    return res.render("campgrounds/edit", { campground: foundCampground });
}));
router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true });

    return res.redirect(`/campgrounds/${id}`);
}));

//Delete Campground
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);

    return res.redirect("/campgrounds");
}));

module.exports = router