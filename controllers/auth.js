const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.auth,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("603232ef3597cd1160ba4df6")
    .then((user) => {
      req.session.auth = user;
      req.session.save((error) => {
        console.log(error);
        res.redirect("/");
      });
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect("/");
  });
};
