const Joi = require("joi");
const Listing = require("./models/listing");
const Review = require("./models/review");

const ListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null), // Use lowercase for consistency
    price: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(), // Use lowercase for consistency
  }).required(),
});

module.exports = { ListingSchema, reviewSchema };
