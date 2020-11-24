const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./utils/database');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findByPk(1)
//     .then(user => {
//         req.user = user;
//         next();
//     })
//     .catch(err => console.logg(err));
// });

// app.use('/admin', adminRoutes.routes);
// app.use(shopRoutes);

// Basic 404 Page not found
app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: '404 Not Found', path: 'path'});
});

mongoConnect(client => {
    console.log(client);
    app.listen(3000);
});