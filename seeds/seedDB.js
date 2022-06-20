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

        const images= [
            {
                url: 'https://res.cloudinary.com/dtzsq6zws/image/upload/v1655446913/canada-british-columbia-parksville-best-campgrounds-intro-paragraph-camping-rathtrevor-beach_ffm4ob.jpg',
                filename: ''
            },
            {
                url: 'https://res.cloudinary.com/dtzsq6zws/image/upload/v1655446913/canada-british-columbia-parksville-best-campgrounds-intro-paragraph-camping-rathtrevor-beach_ffm4ob.jpg',
                filename: ''
            }
          ];

        const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

        const price = Math.floor(Math.random() * 20) + 10;

        const campground = new Campground({
            title: pickedName,
            location: `${city}, ${state}`,
            images,
            description,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    pickedCity.longitude,
                    pickedCity.latitude
                ]
            },
            author: "62a5754898565de7ada139b5"
        });

        await campground.save();
    };

    return mongoose.connection.close();
}

seedDB(200);