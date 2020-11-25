const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5fbd9bcd40b3be2981eee8a8')
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

mongoose.connect('mongodb+srv://admin:pastword@cluster0.zbc2y.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                username: 'Zach',
                email: 'z@z.c',
                cart: {
                    items: []
                }
            });
        user.save();
        }
    })
    app.listen(3000);
}).catch(err => {
    console.log(err);
})