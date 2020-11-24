const getDB = require('../utils/database').getDB;

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDB();
        return db.collection('products').insertOne(this)
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err));
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
}

module.exports = Product;