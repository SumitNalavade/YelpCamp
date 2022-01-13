const Joi = require("joi");

//Define joi validation schema
const CampgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()
});
exports.CampgroundSchema = CampgroundSchema