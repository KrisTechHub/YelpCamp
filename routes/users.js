const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');



//REGISTER
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));
//************************ */



//LOGIN
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
//************************ */


//LOGOUT
router.get('/logout', users.logout);
//************************ */

module.exports = router;