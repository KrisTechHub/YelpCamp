const Campground = require('../models/campground') //campground model



//CONTROLLER FOR THE ROUTES
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};