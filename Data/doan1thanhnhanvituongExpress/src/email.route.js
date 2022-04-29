const mailer = require("./mailer");
const express = require("express");
let Email = require("./email.model");

const routes = express.Router();
routes.route("/find-email").post(function (req, res) {
  const { reAddress } = req.body;
  Email.find({ reAddress: reAddress, isUnRead: true }, function (err, emails) {
    if (err) {
      console.log(err);
    } else {
      res.json(emails);
    }
  });
});

routes.route("/update-email").put(function (req, res) {
  const { reAddress } = req.body;
  Email.updateMany(
    { reAddress: reAddress },
    { isUnRead: false },
    function (err, emails) {
      if (err) console.log(err);
      else res.json(emails);
    }
  );
});

routes.route("/update-email-by-id").put(function (req, res) {
  const { _id } = req.body;
  Email.updateOne({ _id: _id }, { isUnRead: false }, function (err, emails) {
    if (err) console.log(err);
    else res.json(emails);
  });
});
routes.route("/send").post(function (req, res) {
  // Lấy data truyền lên từ form phía client
  let email = new Email({
    ...req.body,
    seAddress: process.env.ADMIN_EMAIL,
    reAddress: req.body.to,
  });

  email
    .save()
    .then(() => {
      // Thực hiện gửi email
      mailer
        .sendMail(req.body.to, req.body.subject, req.body.htmlContent)
        .catch((error) => {
          // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
          console.log(error);
          res.send(error);
        });
      res.status(200).json("Your email has been sent successfully");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});
module.exports = routes;
