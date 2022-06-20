const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary/index");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});
ImageSchema.virtual("cardImage").get(function() {
    return this.url.replace("/upload", "/upload/ar_4:3,c_crop");
});

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, { toJSON: { virtuals: true } });

CampgroundSchema.virtual("properties.popupMarkup").get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`;
})

CampgroundSchema.post("findOneAndDelete", async function(doc) {
    if(!doc) { return }

   await Review.deleteMany({
       _id: {
           $in: doc.reviews
       }
   });  
   
   for(let img of doc.images) {
        await cloudinary.uploader.destroy(img.filename);
   };
});

module.exports = mongoose.model("Campground", CampgroundSchema);