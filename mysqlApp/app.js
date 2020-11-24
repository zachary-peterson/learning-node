const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.logg(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Basic 404 Page not found
app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: '404 Not Found', path: 'path'});
});

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart)
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


//sequelize.sync({ force: true })
sequelize.sync()
.then(res => {
    return User.findByPk(1);
    // console.log(res);
})
.then(user => {
    if (!user) {
        return User.create({ name: 'Test', email: 'z@z.c'});
    }
    return Promise.resolve(user);
}).then(user => {
    // console.log(user);
    return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});