
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: 'SG.oNDtpUq9RRGyttV7ZeNBuA.5RRFyJA6XNLL0MpODRtUX9RiVR8MxepeK1PR0kqVN-c'
    }
}));

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        docTitle: 'Sign Up',
        errorMessage: message
    });
};

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1]
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confrimPassword;
    User.findOne({email: email})
    .then(userDoc => {
        if (userDoc) {
            req.flash('error', 'Email already in use')
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        });
        return user.save();
    })
    .then(result => {
        res.redirect('/login');
        return transporter.sendMail({
            to: email,
            from: 'zachary-peterson@lambdastudents.com',
            subject: 'Sign-up Complete',
            html: '<h1>Coolio</h1>'
        })
      });
    })
    .catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password')
            return res.redirect('login');
        }
        bcrypt.compare(password, user.password)
        .then(authenticated => {
            if(authenticated) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    console.log(err)
                    return res.redirect('/');
                })
            }
            req.flash('error', 'Invalid email or password')
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login')
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