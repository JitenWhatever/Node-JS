const express = require("express");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid E-Mail")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Invalid email or password.");
          }
          return bcrypt
            .compare(req.body.password, user.password)
            .then((doMatch) => {
              if (!doMatch) {
                return Promise.reject("Invalid email or password.");
              }
              req.session.auth = user;
            });
        });
      }),
  ],
  authController.postLogin
);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid E-Mail")
      .custom((value, { req }) => {
        /* if (value === "test@test.com") {
          throw new Error("This email address is forbidden.");
        }
        return true; */
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please use different E-Mail"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "please enter a password with only numbers and text and atleast 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);

exports.routes = router;
