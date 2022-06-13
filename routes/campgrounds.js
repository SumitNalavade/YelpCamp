const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require("../middleware"); 

router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})

    return res.render("campgrounds/index", { campgrounds });
}));

//Create new campground
router.get("/new", isLoggedIn, (req, res) => {
    return res.render("campgrounds/new");
});
router.post("/", validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
    const userID = req.user._id;
    const newCampground = new Campground(req.body.campground);
    newCampground.author = userID;
    await newCampground.save();
    
    req.flash("success", "Successfully made a new campground!");

    return res.redirect(`campgrounds/${newCampground.id}`);
}));

//Display details of specific campgrounds given ID
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;

    const foundCampground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

    if(!foundCampground) { 
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }

    return res.render("campgrounds/show", { campground: foundCampground });
}));

//Edit Campground
router.get("/:id/edit", isLoggedIn, isCampgroundAuthor ,catchAsync(async (req, res) => {    
    const { id } = req.params;

    const foundCampground = await Campground.findById(id);

    if(!foundCampground) { 
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    };

    return res.render("campgrounds/edit", { campground: foundCampground });
}));
router.put("/:id", validateCampground, isLoggedIn, isCampgroundAuthor ,catchAsync(async (req, res) => {
    const { id } = req.params;
    const loggedInUser = req.user._id;
    
    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true });

    req.flash("success", "Successfully updated campground!")

    return res.redirect(`/campgrounds/${id}`);
}));

//Delete Campground
router.delete("/:id", isLoggedIn, isLoggedIn ,catchAsync(async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfuly deleted campground!");

    return res.redirect("/campgrounds");
}));

module.exports = router