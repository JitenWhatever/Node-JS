const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-js", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
