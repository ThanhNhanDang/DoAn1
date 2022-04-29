const express = require("express");
const routes = express.Router();

let Relay1 = require("./relay1.model");
// const database = "Doan1";
routes.route("/get-all").get(function (req, res) {
  Relay1.find(function (err, relay) {
    if (err) {
      console.log(err);
    } else {
      res.json(relay);
    }
  }).sort({ _id: -1 });
});

routes.route("/get-all/chart").get(function (req, res) {
  Relay1.find(function (err, relay) {
    if (err) {
      console.log(err);
    } else {
      res.json(relay);
    }
  })
    .sort({ _id: -1 })
    .limit(20); //sắp xếp giảm dần mới nhất đến cũ nhất
});

routes.route('/add').post(function (req, res) {
  let relay1 = new Relay1(req.body);
  relay1.save()
      .then(person => {
          res.status(200).json("Insert Relay Successfully !");
      })
      .catch(err => {
          res.status(400).send("unable to save to database");
      });
});

module.exports = routes;
