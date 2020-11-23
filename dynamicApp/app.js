const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Basic 404 Page not found
app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: '404 Not Found', path: 'path'});
});


app.listen(3000);