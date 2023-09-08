const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params true to merge the params in reviews and campground routers
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');



//UTILITIES
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


//MODELS
const Review = require('../models/review');
const Campground = require('../models/campground') //campground model



//ROUTERS
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;