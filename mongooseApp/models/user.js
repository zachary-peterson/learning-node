// const mongodb = require('mongodb');
// const getDB = require('../utils/database').getDB;
// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart; // {items: []}
//         this._id = id;
//     }

//     save() {
//         const db = getDB();
//         let dbOp;
//         if (this._id) {
//             dbOp = db.collection('users')
//             .updateOne({ _id: new mongodb.ObjectID(this._id) }, 
//             { $set: this });
//         } 
//         else {
//             dbOp = db.collection('users')
//             .insertOne(this)
//         }
//         return dbOp
//             .then(res => {
//                 console.log(res);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     addToCart(product) {
//         const cartItemIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (cartItemIndex >= 0) {
//             newQuantity = this.cart.items[cartItemIndex].quantity + 1;
//             updatedCartItems[cartItemIndex].quantity = newQuantity;
//         }else {
//             updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity })
//         }

//         const updatedCart = {
//             items: updatedCartItems
//         };

//         const db = getDB();

//         return db.collection('users').updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: updatedCart } }
//         );
//     }

//     getCart() {
//         const db = getDB();
//         const productIDs = this.cart.items.map(i => {
//             return i.productId;
//         })
//         return db.collection('products').find({_id: {$in: productIDs } })
//         .toArray()
//         .then(products => {
//             return products.map(p => {
//                 return {...p, quantity: this.cart.items.find(i => {
//                     return i.productId
//                         .toString() === p._id.toString();
//                 }).quantity
//                 }
//             })
//         });
//     }

//     deleteItemFromCart(prodId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== prodId.toString();
//         });
//         const db = getDB();

//         return db.collection('users').updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: {items: updatedCartItems} } }
//         );
//     }

//     addOrder() {
//         const db = getDB();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     username: this.username,
//                     email: this.email
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//         .then(result => {
//             this.cart = {items: []};
//             return db.collection('users').updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: {items: []} } }
//             );
//         });
//     }

//     getOrders() {
//         const db = getDB();
//         return db.collection('orders')
//         .find({ 'user._id': new ObjectId(this._id) })
//         .toArray();
//     }

//     static findById(userId) {
//         const db = getDB();
//         return db.collection('users')
//         .find({ _id: new mongodb.ObjectId(userId) })
//         .next()
//         .then(user => {
//             console.log(user);
//             return user;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
// }

// module.exports = User;