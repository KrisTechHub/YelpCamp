const express = require('express');
const router = express.Router({mergeParams : true}); //merge params true to merge the params in reviews and campground routers
const { reviewSchema} = require('../schemas.js');


//UTILITIES
const ExpressError = require('../Utilities/ExpressError');
const catchAsync = require('../Utilities/catchAsync');


//MODELS
const Review = require('../models/review');
const Campground = require('../models/campground') //campground model


//MIDDLEWARE FOR VALIDATION
const validateReview = (req, res, next) => { //middleware for review 
        const { error } = reviewSchema.validate(req.body)
        if (error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
}


//ROUTERS
router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete('/:reviewId', catchAsync( async(req, res) => {
    const { id, reviewId } = req.params; //find ID
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //remove from array mongo, $pull anything on that Id in reviews
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;