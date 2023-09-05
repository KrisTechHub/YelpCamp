const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')//where the controller are
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground') //campground model
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//MULTER middleware to parse multipart/form-data for file uploads
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

//restructuring routes (grouping routes with same path)
router.route('/')
    .get(catchAsync(campgrounds.index)) //list all campgrounds (campground is the controller)
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.crateCampground));//save newly create campground to database
//************************ */


//add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
//************************ */


// routes with ('/:id') route
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) //show detail on campround
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)) //SAVE edit campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); //delete a campground
//************************ */


//EDIT campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
//************************ */


module.exports = router;