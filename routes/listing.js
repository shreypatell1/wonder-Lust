const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilits/wrapAsync");
const ExpressError = require("../utilits/ExpressError");
const Listing = require("../models/listing");
const { ListingSchema } = require("../schema.js");
const { isLoginIn, isOwner } = require("../middleware.js");
const listingcontroller = require("../controller/listing.js");
const { storage, upload } = require("../cloudConfig.js");
const multer = require("multer");
// const upload = multer({ dest: storage })

// Validate Listing
const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route and create route
router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    upload.single("listing[image]", validateListing),
    wrapAsync(listingcontroller.CreateSave)
  );

router.get("/new", isLoginIn, listingcontroller.create);

// Show Route, Update, Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingcontroller.show))
  .put(
    isLoginIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.update)
  )
  .delete(isLoginIn, isOwner, wrapAsync(listingcontroller.destroy))

  .get(listingcontroller.send);

// Edit route
router.get("/:id/edit", isLoginIn, isOwner, wrapAsync(listingcontroller.edit));

module.exports = router;
