const express = require('express');
const { check, body } = require('express-validator/check')
const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user');

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

router.post('/signup', 
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .custom((value, {req}) => {
            // if (value === 'test@testt.com') {
            //     throw new Error('Not Valid');
            // }
            // return true
            return User.findOne({email: email})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already in use!')
                    }
                    return true
        })}), 
        body('password').isLength({min: 5}).isAlphanumeric(),
        body('confirmPassowrd').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true
        })
    ,
    authController.postSignup
);

router.post('/login',[
    check('email').isEmail().withMessage('Please entre a valid email address'),
    body('password').isLength({min: 5}).isAlphanumeric()
], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;