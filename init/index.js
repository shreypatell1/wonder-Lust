const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then((res) => {
    console.log("db is working");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wunderlust");
}

const initdb = async () => {
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "66af6cfc22527935f43230cd",
  }));
  await Listing.insertMany(initdata.data);
  console.log("completed");
};

initdb();
