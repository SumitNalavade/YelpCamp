const mongoose = require("mongoose");

const Campground = require("../models/campground");
const cities = require("./cities");
const { getRandomTitle } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Datbase connected");
});

//Delete everything from the database and make and add new campgrounds
async function seedDB(count) {
    await Campground.deleteMany({});
    
    for(let i = 0; i < count; i++) {
        const randomPicker = Math.floor(Math.random() * 1000);
        const pickedCity = cities[randomPicker]; //Imported from the cities.js file
        const { city, state } = pickedCity;
        const pickedName = getRandomTitle(); //Imported from the seedHelpers.js file

        const campground = new Campground({
            title: pickedName,
            location: `${city}, ${state}`
        });

        await campground.save().catch((error) => {
            console.log(error);
        });
    };

    return mongoose.connection.close();
}

seedDB(50);