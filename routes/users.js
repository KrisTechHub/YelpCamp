const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');



//REGISTER
router.get('/register', users.renderRegister);
router.post('/register', catchAsync(users.register));
//************************ */



//LOGIN
router.get('/login', users.renderLogin)
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
//************************ */


//LOGOUT
router.get('/logout', users.logout);
//************************ */

module.exports = router;