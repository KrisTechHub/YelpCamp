const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body //get info from the req.body
    const user = new User({ email, username }); //pass info in the form to a new user in database
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash('Welcome to YelpCamp!');
    res.redirect('/campgrounds');
})

module.exports = router;