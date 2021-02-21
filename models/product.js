const mongoDB = require("mongodb");

const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, _id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = _id ? new mongoDB.ObjectId(_id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOperation = db.collection("products");
    if (this._id) {
      dbOperation = dbOperation.updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = dbOperation.insertOne(this);
    }
    return dbOperation
      .then((result) => {
        console.log("Product Updated!");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => console.log(error));
  }

  static findProductById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongoDB.ObjectId(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((error) => console.log(error));
  }

  static deleteProductById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDB.ObjectId(productId) })
      .then((result) => {
        console.log("Product Deleted!");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Product;
