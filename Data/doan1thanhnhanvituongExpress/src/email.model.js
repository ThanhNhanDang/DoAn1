const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Email = new Schema(
  {
    topic: {
      type: String,
    },
    reAddress: {
      type: String,
    },
    seAddress: {
      type: String,
    },
    time: {
      type: String,
    },
    isUnRead: {
      type: Boolean,
    },
  },
  {
    collection: "email",
  }
);

module.exports = mongoose.model("Email", Email);
