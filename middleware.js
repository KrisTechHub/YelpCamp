const { campSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./Utilities/ExpressError');
const Campground = require('./models/campground') //campground model



//middleware function to verify if logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl //store the url the user is rquesting
        req.flash('error', 'You must  be signed in to access requested page!');
        return res.redirect('/login');
    }
    next();
};
//************************



//middleware function to return to original page before user log in
module.exports.storeReturnTo = (req, res, next) => { //middleware to use returnTo function
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
//************************



//middleware function for validating campground
module.exports.validateCampground = (req, res, next) => {
    const { error } = campSchema.validate(req.body) //2. validate req.body
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
//************************ */



//middleware function for signed in user is author or not
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params; //find ID
    const campground = await Campground.findById(id); ///select the ID
    //only update if the user is the author
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not auhorized to update this campground. Please contact the author for permission!')
        return res.redirect(`/campgrounds/${campground._id}`) //use RETURN for this to work
    }
    next();
};
//************************ */




//middleware function for validating reviews
module.exports.validateReview = (req, res, next) => { //middleware for review 
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
//************************ */
