const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("603232ef3597cd1160ba4df6")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes.routes);
app.use(errorRoutes.routes);

mongoose
  .connect(
    "mongodb+srv://node_js:nphEHhnkAkodRdSI@cluster0.fevgn.mongodb.net/NodeJS?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((client) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Jiten",
          email: "Jiten@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
