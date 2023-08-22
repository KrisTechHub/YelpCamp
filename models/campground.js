const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    Location: String
});

module.exports = mongoose.model('Campground', CampGroundSchema);