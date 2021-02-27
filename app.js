const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://node_js:nphEHhnkAkodRdSI@cluster0.fevgn.mongodb.net/NodeJS?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/error");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "coderush",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.auth) {
    return next();
  }
  User.findById(req.session.auth._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.auth;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes.routes);
app.use(authRoutes.routes);
app.use(errorRoutes.routes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then((client) => {
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
