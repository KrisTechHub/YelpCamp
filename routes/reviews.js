const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params true to merge the params in reviews and campground routers
const { validateReview, isLoggedIn } = require('../middleware');



//UTILITIES
const ExpressError = require('../Utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');


//MODELS
const Review = require('../models/review');
const Campground = require('../models/campground') //campground model



//ROUTERS
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Congratulations! Successfully posted your review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params; //find ID
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //remove from array mongo, $pull anything on that Id in reviews
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Hollaaa! Successfully deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;