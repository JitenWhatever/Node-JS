const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const User = require("./models/user");

const MONGODB_URI = "mongodb://127.0.0.1:27017/NODE_JS";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, "images");
  },
  filename: (_req, file, callback) => {
    callback(null, file.originalname);
  },
});

const filter = (_req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/error");
const authRoutes = require("./routes/auth");

app.use(express.urlencoded({ extended: false }));
app.use(
  multer({
    fileFilter: filter,
    storage: fileStorage,
  }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

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
  res.locals.isAuthenticated = req.session.auth;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, _res, next) => {
  if (!req.session.auth) {
    return next();
  }
  User.findById(req.session.auth._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((error) => {
      next(new Error(error));
    });
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes.routes);
app.use(authRoutes.routes);
app.use(errorRoutes.routes);
app.use((error, _req, res, _next) => {
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then((_client) => {
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
