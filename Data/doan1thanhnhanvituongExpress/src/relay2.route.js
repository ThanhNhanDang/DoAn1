const express = require("express");
const routes = express.Router();

let Relay2 = require("./relay2.model");
// const database = "Doan1";
routes.route("/get-all").get(function (req, res) {
  Relay2.find(function (err, relay) {
    if (err) {
      console.log(err);
    } else {
      res.json(relay);
    }
  }).sort({ _id: -1 });
});

routes.route("/get-all/chart").get(function (req, res) {
  Relay2.find(function (err, relay) {
    if (err) {
      console.log(err);
    } else {
      res.json(relay);
    }
  })
    .sort({ _id: -1 })
    .limit(20); //sắp xếp giảm dần mới nhất đến cũ nhất
});

routes.route("/add").post(function (req, res) {
  let relay2 = new Relay2(req.body);
  relay2
    .save()
    .then((person) => {
      res.status(200).json("Insert Relay Successfully !");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

module.exports = routes;
