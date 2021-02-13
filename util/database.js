const mysql = require("mysql2");

const connectionPool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-js",
  password: "root",
});

module.exports = connectionPool.promise();
