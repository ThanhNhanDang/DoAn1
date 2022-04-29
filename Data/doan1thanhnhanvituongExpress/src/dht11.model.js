const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Dht11 = new Schema(
  {
    topic: {
      type: String,
    },
    idgw: {
      type: Number,
    },
    temp: {
      type: Number,
    },
    humid: {
      type: Number,
    },
    time: {
      type: String,
    },
    warning: {
      type: Boolean,
    }
  },
  {
    collection: "dht11",
  }
);

module.exports = mongoose.model("Dht11", Dht11);
