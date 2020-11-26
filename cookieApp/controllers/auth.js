const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1]
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('5fbd9bcd40b3be2981eee8a8')
    .then(user => {
        req.session.isLoggedIn = true;
        req.user = user;
        res.session.save((err) => {
            res.redirect('/')
        })
    })
    .catch(err => console.logg(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/');
    });
};