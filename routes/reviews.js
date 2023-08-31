const express = require('express');
const router = express.Router();
const { reviewSchema} = require('../schemas.js');



const validateReview = (req, res, next) => { //middleware for review 
        const { error } = reviewSchema.validate(req.body)
        if (error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
}

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))


app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async(req, res) => {
    const { id, reviewId } = req.params; //find ID
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //remove from array mongo, $pull anything on that Id in reviews
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`);
}))


