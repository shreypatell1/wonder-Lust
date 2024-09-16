const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");
app.use(methodOverride("_method"));
require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (error) => {
  console.log("ERROR IN MONGO SESSION STORE", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Use routers as middleware
app.use("/listings", require("./routes/listing.js"));
app.use("/listings/:id/reviews", require("./routes/Reviews.js"));
app.use("/", require("./routes/user.js"));

app.listen(3000, () => {
  console.log("connection is successful");
});

app.all("*", (req, res, next) => {
  res.render("listing/error2.ejs");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  console.error(`Error: ${message}, Status Code: ${statusCode}`);
  res.status(statusCode);
  res.render("listing/error.ejs", { message, statusCode });
});

app.use((req, res, next) => {
  res.locals.currUser = req.session.user || null; // Ensure you have session middleware and user stored in session
  next();
});

module.exports = app;
