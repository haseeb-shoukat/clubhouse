var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET sign up page. */
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});

/* GET log in page. */
router.get("/log-in", function (req, res, next) {
  res.render("log-in");
});

module.exports = router;
