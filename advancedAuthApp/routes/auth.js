const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;