const express = require('express');
const router = express.Router();
const ExpressError = require('../Utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground') //campground model
const { campSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');


//middleware function for validating campground
const validateCampground = (req, res, next) => {
    const { error } = campSchema.validate(req.body) //2. validate req.body
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
//************************ */



//list all campgrounds
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});
//************************ */



//add new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
//************************ */



//save newly added campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id//assign current logged in user as the author to the newly created campground
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));
//************************ */



//show detail on campround
router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author') //find by ID
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));
//************************ */



//edit campground
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id) //find by ID
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));
//************************ */



//show after edit campground
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params; //find ID
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) //find by ID
    req.flash('success', 'Great! Successfully updated your campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));
//************************ */



//delete a campground
router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params; //find ID
    await Campground.findByIdAndDelete(id) //find by ID
    req.flash('success', 'Hollaaa! Successfully deleted your campground!');
    res.redirect('/campgrounds');
}));
//************************ */



module.exports = router;