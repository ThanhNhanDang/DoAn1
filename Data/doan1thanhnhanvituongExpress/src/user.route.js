const express = require("express");
const routes = express.Router();

let User = require("./user.model");
// const database = "Doan1";
routes.route("/get-all").get(function (req, res) {
  User.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

routes.route("/add").post(function (req, res) {
  let user = new User(req.body);
  user
    .save()
    .then((person) => {
      res.status(200).json("Insert User Successfully.!");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});
routes.route("/find-user").post(function (req, res) {
  const { email } = req.body;
  User.find({ email: email }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});
module.exports = routes;
