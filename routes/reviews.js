const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params true to merge the params in reviews and campground routers
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');



//UTILITIES
const ExpressError = require('../Utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');


//MODELS
const Review = require('../models/review');
const Campground = require('../models/campground') //campground model



//ROUTERS
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params; //find ID
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //remove from array mongo, $pull anything on that Id in reviews
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Hollaaa! Successfully deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;