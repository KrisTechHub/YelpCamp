const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');



//REGISTER
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body //get info from the req.body
        const user = new User({ email, username }); //pass info in the form to a new user in database
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function (err) { //automatic log in after registratioin
            if (err) {
                return next(err);
            }
            req.flash('success', `You have successfully registered ${registeredUser.username}. Welcome to YelpCamp!`);
            return res.redirect('/campgrounds');
        }); //**********************************
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}));
//************************ */



//LOGIN
router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    // passport.authenticate logs the user in and clears req.session
    req.flash('success', 'Welcome back to YelpCamp');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; //return to page where user want to access before logging in
    delete req.session.returnTo; //delete after returning
    res.redirect(redirectUrl);
});
//************************ */


//LOGOUT
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out!')
        res.redirect('/campgrounds');
    });
});
//************************ */

module.exports = router;