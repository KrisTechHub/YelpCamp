const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');


//REGISTER
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body //get info from the req.body
        const user = new User({ email, username }); //pass info in the form to a new user in database
        const registeredUser = await User.register(user, password);
        req.flash('success', 'You have successfully registered. Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}));


//LOGIN
router.get('/login', catchAsync(async (req, res) => {

}))

module.exports = router;