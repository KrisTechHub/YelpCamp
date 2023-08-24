const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: String,
    image: String,
    id: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampGroundSchema);