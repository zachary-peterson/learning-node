const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const User = require('./models/user');
const mongoose = require('mongoose');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findById('5fbcbdd596b22fc7d56f3c03')
//     .then(user => {
//         req.user = new User(user.username, user.email, user.cart, user._id);
//         next();
//     })
//     .catch(err => console.logg(err));
// });

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Basic 404 Page not found
app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: '404 Not Found', path: 'path'});
});

mongoose.connect('mongodb+srv://admin:pastword@cluster0.zbc2y.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})