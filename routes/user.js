const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");

router
  .route("/signup")
  .get(usercontroller.signupRender)
  .post(usercontroller.signup);

router
  .route("/login")
  .get(usercontroller.loginRender)
  .post(
    saveredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.login
  );

router.get("/logout", usercontroller.logout);

module.exports = router;
