const mongodb = require('mongodb');
const getDB = require('../utils/database').getDB;
const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        const db = getDB();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('users')
            .updateOne({ _id: new mongodb.ObjectID(this._id) }, 
            { $set: this });
        } 
        else {
            dbOp = db.collection('users')
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

    static findById(userId) {
        const db = getDB();
        return db.collection('users')
        .findOne({ _id: new  ObjectId(userId) })
        .next()
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => {
            console.log(err);
        })
    }
}

module.exports = User;