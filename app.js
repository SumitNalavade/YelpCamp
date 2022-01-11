const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Datbase connected");
});

const app = express();
const PORT = process.env.PORT || 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded());
app.use(methodOverride('_method'));

app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
});

//Display all campgrounds
app.get("/", (req, res) => {
    res.redirect("/campgrounds");
});
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({}).catch((error) => {
        console.log(error);
        return res.send("Error");
    });

    return res.render("campgrounds/index", { campgrounds });
});

//Create new campground
app.get("/campgrounds/new", (req, res) => {
    return res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
    const { title, location, description, price, image } = req.body.campground;

    const newCampground = new Campground({ title, location, description, price, image });
    await newCampground.save().catch((error) => {
        console.log(error);
        return res.send("Error");
    });

    return res.redirect(`campgrounds/${newCampground.id}`);
});

//Display details of specific campgrounds given ID
app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;

    const foundCampground = await Campground.findById(id).catch((error) => {
        console.log(error);
        return res.send("Error");
    });

    return res.render("campgrounds/show", { campground: foundCampground });
});

//Edit Campground
app.get("/campgrounds/:id/edit", async (req, res) => {    
    const { id } = req.params;

    const foundCampground = await Campground.findById(id);

    return res.render("campgrounds/edit", { campground: foundCampground });
});
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndUpdate(id, { ...req.body.campground }).catch((error) => {
        console.log(error);
        return res.send("Error");
    });

    return res.redirect(`/campgrounds/${id}`);
});

//Delete Campground
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id).catch((error) => {
        console.log("Error");
        return res.send("Error");  
    });

    return res.redirect("/campgrounds");
});

