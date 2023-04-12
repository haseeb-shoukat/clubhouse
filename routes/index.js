var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET sign up page. */
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});

/* POST sign up page */
router.post("/sign-up", [
  body("first_name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("First name must be between 1 and 100 characters.")
    .isAlphanumeric()
    .withMessage("First name cannot have non-alphanumeric characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Last name must be between 1 and 100 characters.")
    .isAlphanumeric()
    .withMessage("Last name cannot have non-alphanumeric letters."),
  body("email")
    .trim()
    .isLength({ min: 1, max: 255 })
    .escape()
    .withMessage("Email must be between 1 and 255 characters.")
    .isEmail()
    .withMessage("Invalid Email. Make sure email is in correct form.")
    .custom((value) => {
      return User.find({ email_address: value })
        .then((result) => {
          if (result === "") {
            return Promise.reject("Email already in use");
          }
          return Promise.resolve(true);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }),
  body("username")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape()
    .withMessage("Username must be between 3 and 40 characters.")
    .isAlphanumeric()
    .withMessage("Username cannot have non-alphanumeric characters.")
    .custom((value) => {
      return User.find({ username: value })
        .then((result) => {
          if (result === "") {
            return Promise.reject("Username is taken.");
          }
          return Promise.resolve(true);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }),
  body("password")
    .isStrongPassword({ minSymbols: 0 })
    .withMessage(
      "Password must be min. 8 characters and contain an uppercase, a lowercase, and a number."
    ),
  body("re_password").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("sign-up", {
        title: "Create Author",
        user: req.body,
        errors: errors.mapped(),
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_address: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      });

      user.save().catch((err) => {
        return next(err);
      });

      res.redirect("/");
    });
  },
]);

/* GET log in page. */
router.get("/log-in", function (req, res, next) {
  res.render("log-in");
});

module.exports = router;
