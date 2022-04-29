const express = require("express");
const routes = express.Router();

let Dht11 = require("./dht11.model");
// const database = "Doan1";
routes.route("/dht11/get-all").get(function (req, res) {
  Dht11.find(function (err, dht11) {
    if (err) {
      console.log(err);
    } else {
      res.json(dht11);
    }
  }).sort({ _id: -1 });
});
routes.route("/dht11/get-all/chart").get(function (req, res) {
  Dht11.find(function (err, dht11) {
    if (err) {
      console.log(err);
    } else {
      res.json(dht11);
    }
  })
    .sort({ _id: -1 })
    .limit(3000); //sắp xếp giảm dần mới nhất đến cũ nhất
});

routes.route("/dht11/add").post(function (req, res) {
  let dht11 = new Dht11(req.body);
  dht11
    .save()
    .then((person) => {
      res.status(200).json("Insert Dht11 Successfully !");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
    
});

module.exports = routes;
