//MODELS
const Review = require('../models/review');
const Campground = require('../models/campground') //campground model


//controller for creting review
module.exports.createReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Congratulations! Successfully posted your review!');
    res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; //find ID
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //remove from array mongo, $pull anything on that Id in reviews
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Hollaaa! Successfully deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}