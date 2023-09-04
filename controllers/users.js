const User = require('../models/user');


//render register form
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}


//register
module.exports.register = async (req, res, next) => {
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
};


//login
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
};


module.exports.login = (req, res) => {
    // passport.authenticate logs the user in and clears req.session
    req.flash('success', 'Welcome back to YelpCamp');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; //return to page where user want to access before logging in
    delete req.session.returnTo; //delete after returning
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out!')
        res.redirect('/campgrounds');
    });
}