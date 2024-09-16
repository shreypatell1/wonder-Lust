const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoginIn = (req, res, next) => {
  console.log(req.user);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You Must be logged in to Create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveredirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let biodata = await Listing.findById(id);
  if (!biodata.owner._id.equals(req.user._id)) {
    req.flash("error", "You're not Owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You're not Deleteing this Review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
