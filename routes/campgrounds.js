const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground') //campground model
const User = require('../models/user');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');




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
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    console.log(campground);
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));
//************************ */



//EDIT campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id) //find by ID
    //if campground does not exist:
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));
//************************ */



//SAVE edit campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params; //find ID
    const campground = await Campground.findByIdAndUpdate(id); ///select the ID
    req.flash('success', 'Great! Successfully updated your campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));
//************************ */



//delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params; //find ID
    const campground = await Campground.findById(id); ///select the ID
    //only DELETE if the user is the author
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not auhorized to delete this campground. Please contact the author for permission!')
        return res.redirect(`/campgrounds/${campground._id}`) //use RETURN for this to work
    }
    await Campground.findByIdAndDelete(id) //find by ID
    req.flash('success', 'Hollaaa! Successfully deleted your campground!');
    res.redirect('/campgrounds');
}));
//************************ */



module.exports = router;