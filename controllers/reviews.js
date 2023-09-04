//MODELS
const Review = require('../models/review');
const Campground = require('../models/campground') //campground model

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