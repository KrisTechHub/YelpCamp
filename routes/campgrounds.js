const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')//where the controller are
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground') //campground model
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');





//list all campgrounds
router.get('/', catchAsync(campgrounds.index)); //campground is the controller
//************************ */


//add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
//************************ */


//save newly added campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.crateCampground));
//************************ */


//show detail on campround
router.get('/:id', catchAsync(campgrounds.showCampground));
//************************ */


//EDIT campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
//************************ */



//SAVE edit campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
//************************ */



//delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
//************************ */



module.exports = router;