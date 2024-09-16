const passportLocalmongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

Userschema.plugin(passportLocalmongoose);
module.exports = mongoose.model("User", Userschema);
