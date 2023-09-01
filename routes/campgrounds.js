const express = require('express');
const router = express.Router();
const ExpressError = require('../Utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground') //campground model
const { campSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');



const validateCampground = (req, res, next) => { //middleware function
    const { error } = campSchema.validate(req.body) //2. validate req.body
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



router.get('/', async (req, res) => { //all campgrounds
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});


router.get('/new', isLoggedIn, (req, res) => {//add new campground
    res.render('campgrounds/new');
});


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => { //add new campground
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));


router.get('/:id', isLoggedIn, catchAsync(async (req, res, next) => { //show detail on campround
    const campground = await Campground.findById(req.params.id).populate('reviews') //find by ID
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));


router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => { //edit campground
    const campground = await Campground.findById(req.params.id) //find by ID
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));


router.put('/:id', validateCampground, catchAsync(async (req, res, next) => { //show after edit campground
    const { id } = req.params; //find ID
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) //find by ID
    req.flash('success', 'Great! Successfully updated your campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));


router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {//delete campground
    const { id } = req.params; //find ID
    await Campground.findByIdAndDelete(id) //find by ID
    req.flash('success', 'Hollaaa! Successfully deleted your campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;