const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const PORT = 4000;
const cors = require("cors");

const config = require("./DB.js");
const dht11Route = require("./dht11.route");
const userRoute = require("./user.route");
const relay1Route = require("./relay1.route");
const relay2Route = require("./relay2.route");
const emailRoute = require("./email.route");

/////////////////////////////////////

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
  },
  (err) => {
    console.log("Can not connect to the database" + err);
  }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/doan1/", dht11Route);
app.use("/doan1/relay1", relay1Route);
app.use("/doan1/user", userRoute);
app.use("/doan1/relay2", relay2Route);
// Gọi hành động gửi email
app.use("/doan1/email", emailRoute);

app.listen(process.env.PORT || PORT, function () {
  console.log("Server is running on Port:", process.env.PORT || PORT);
});
