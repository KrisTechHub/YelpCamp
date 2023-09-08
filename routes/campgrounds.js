const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')//where the controller are
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//require cloudinary storage to store uploaded images
const { storage } = require('../cloudinary');

//MULTER middleware to parse multipart/form-data for file uploads
const multer = require('multer')
const upload = multer({ storage });//upload files to cloudinary storage

//restructuring routes (grouping routes with same path)
router.route('/')
    .get(catchAsync(campgrounds.index)) //list all campgrounds (campground is the controller)
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))//save newly create campground to database
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("You successfully uploaded your image for camping")
// })
//************************ */


//add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
//************************ */


// routes with ('/:id') route
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) //show detail on campround
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) //SAVE edit campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); //delete a campground
//************************ */


//EDIT campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
//************************ */


module.exports = router;