const express = require('express');
const router = require('express-router');
const catchAsync = require('./Utilities/catchAsync');
const ExpressError = require('./Utilities/ExpressError');
const Campground = require('./models/campground') //campground model


app.get('/', async (req, res) => { //all campgrounds
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds})
});


router.get('/new', (req, res) => {//add new campground
    res.render('campgrounds/new');
});


router.post('/', validateCampground, catchAsync(async (req, res, next) => { //add new campground
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400); //error
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
}));


router.get('/:id', catchAsync(async (req, res, next) => { //show detail on campround
        const campground = await Campground.findById(req.params.id).populate('reviews') //find by ID
        res.render('campgrounds/show', { campground });
}));


router.get('/:id/edit', catchAsync(async (req, res, next) => { //edit campground
    const campground = await Campground.findById(req.params.id) //find by ID
    res.render('campgrounds/edit', { campground });
}));


router.put('/:id', validateCampground, catchAsync(async (req, res, next) => { //show after edit campground
    const { id } = req.params; //find ID
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}) //find by ID
    res.redirect(`/campgrounds/${campground._id}`)
}));


router.delete('/:id', catchAsync(async (req, res, next) => {//delete campground
    const { id } = req.params; //find ID
    await Campground.findByIdAndDelete(id) //find by ID
    res.redirect('/campgrounds');
}));

module.exports = router;