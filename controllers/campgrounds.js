const Campground = require('../models/campground') //campground model
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


//CONTROLLER FOR THE ROUTES

//list all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};//*****************



//add new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};//*****************


//save newly added campground to DB
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({ //call geocoder method
        query: req.body.campground.location,
        limit: 1
    }).send() //send query after calling the function
    const campground = new Campground(req.body.campground); //make a campground from all data in req.body
    campground.geometry = geoData.body.features[0].geometry;//then add geometry coming from geocoding API
    campground.images = req.files.map(f => ({ url: f.path, fileName: f.filename }));//then add the file URLs from cloudinary
    campground.author = req.user._id// then assign current logged in user as the author to the newly created campground
    await campground.save();//then save
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};//************************


//show detail on campround
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};
//************************ */



//EDIT campground
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id) //find by ID
    //if campground does not exist:
    if (!campground) { //error flash 
        req.flash('error', 'Unable to find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};//************************ */



//SAVE edit campground
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params; //find ID
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); ///select the ID
    const imgs = req.files.map(f => ({ url: f.path, fileName: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) { //if there are image to delete, update the specific campground
        for (let filename of req.body.deleteImages) { //select the image to be deleted
            await cloudinary.uploader.destroy(filename); //delete from cloudinary
        }
        await campground.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImages } } } }) //pull from the images array all images with the filename of that image "in" the req.body.deleteImages (selected images for deletion), use $pull to remove from array of images
    }
    req.flash('success', 'Great! Successfully updated your campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};//************************ */



//delete a campground
module.exports.deleteCampground = async (req, res) => {
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
};//************************ */