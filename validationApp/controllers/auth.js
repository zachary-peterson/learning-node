const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const { validationResult } = require('express-validator/check')

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
        errorMessage: message,
        ogInput: { email: "", password: "", confirmPassword: "" }
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

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            docTitle: 'Sign Up',
            errorMessage: errors.array()[0].msg,
            ogInput: { email: email, password: password, confirmPassword: req.body.confirmPassword }
        });
    }

    bcrypt.hash(password, 12)
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
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

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

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        docTitle: 'Reset',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/')
        }

        const token = buffer.toString('hex');
        
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                req.flash('error', 'No user with that email address found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'zachary-peterson@lambdastudents.com',
                subject: 'Reset',
                html: `
                    <p>Pawword reset <a href="http://localhost:3000/reset/${token}">link</a> </p>
                `
            })
        })
        .catch(err => {
            console.log(err);
            
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
    .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-password', {
            path: '/new-password',
            docTitle: 'Update',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
        });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now()}, 
        _id: userId 
    })
    .then(user => {
        resetUser = user
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .catch(err => {
        console.log(err);
    })
}