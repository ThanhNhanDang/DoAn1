const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Business
let User = new Schema(
  {
    email: {
      type: String,
    },
    familyName: {
      type: String,
    },
    givenName: {
      type: String,
    },
    name: {
      type: String,
    },
    time: {
      type: String,
    },
  },
  {
    collection: "user",
  }
);

module.exports = mongoose.model("User", User);
