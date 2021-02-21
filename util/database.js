const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  if (!_db) {
    mongoClient
      .connect(
        "mongodb+srv://node_js:nphEHhnkAkodRdSI@cluster0.fevgn.mongodb.net/NodeJS?retryWrites=true&w=majority"
      )
      .then((client) => {
        console.log("Connected!");
        _db = client.db();
        callback();
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  } else {
    callback();
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No Database Found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
