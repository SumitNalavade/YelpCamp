const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);