const mongodb =require('mongodb');
const getDB = require('../utils/database').getDB;
const ObjectId = mongodb.ObjectId;

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const db = getDB();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products')
            .updateOne({ _id: new mongodb.ObjectID(this._id) }, 
            { $set: this });
        } 
        else {
            dbOp = db.collection('products')
            .insertOne(this)
        }
        return dbOp
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDB();
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(prodId) {
        const db = getDB();
        return db.collection('products')
        .find({ _id: new mongodb.ObjectId(prodId) })
        .next()
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err => {
            console.log(err);
        })
    }

    static deleteById(prodId) {
        const db = getDB();
        return db.collection('products').deleteOne({ _id: new ObjectId(prodId) })
        .then(res => {

        })
        .catch(err => {
            console.log(err);
        })
    }
}

module.exports = Product;