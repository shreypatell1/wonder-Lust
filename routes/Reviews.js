const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilits/wrapAsync");
const ExpressError = require("../utilits/ExpressError");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoginIn, isOwner, isReviewAuthor } = require("../middleware.js");

const Reviewcontroller = require("../controller/review.js");

// Validate Review
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Review route
router.post(
  "/",
  validateReview,
  isLoginIn,
  wrapAsync(Reviewcontroller.createReview)
);

// Review Delete Route
router.delete(
  "/:reviewId",
  isLoginIn,
  isReviewAuthor,
  wrapAsync(Reviewcontroller.destroyReview)
);

module.exports = router;
