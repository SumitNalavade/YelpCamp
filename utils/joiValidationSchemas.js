const Joi = require("joi");

//Define joi validation schema
const CampgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    deleteImage: Joi.array()
});

const ReviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
});

exports.CampgroundSchema = CampgroundSchema
exports.ReviewSchema = ReviewSchema;