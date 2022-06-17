const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Find all campgrounds
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})

    return res.render("campgrounds/index", { campgrounds });
}

// Show a form to make a new campground
module.exports.renderNewForm = (req, res) => {
    return res.render("campgrounds/new");
};

// Create a new campground
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const userID = req.user._id;
    const newCampground = new Campground(req.body.campground);
    newCampground.author = userID;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.geometry = (geoData.body.features[0].geometry);

    await newCampground.save();
    
    req.flash("success", "Successfully made a new campground!");

    return res.redirect(`campgrounds/${newCampground.id}`);
};

//Display details of specific campgrounds given ID
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;

    const foundCampground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

    if(!foundCampground) { 
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }

    return res.render("campgrounds/show", { campground: foundCampground });
};

// Form to edit campground
module.exports.renderEditForm = async (req, res) => {    
    const { id } = req.params;

    const foundCampground = await Campground.findById(id);

    if(!foundCampground) { 
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    };

    return res.render("campgrounds/edit", { campground: foundCampground });
};

// Edit campground
module.exports.editCampround = async (req, res) => {
    const { id } = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    
    await campground.save();

    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}} })
    }

    req.flash("success", "Successfully updated campground!")

    return res.redirect(`/campgrounds/${id}`);
};

// Delete campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfuly deleted campground!");

    return res.redirect("/campgrounds");
};