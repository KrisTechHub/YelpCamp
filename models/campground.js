const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const CampGroundSchema = new Schema({
    title: String,
    image: String,
    id: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// middleware for delete reviews when campground  is deleted
CampGroundSchema.post('findOneAndDelete', async function (doc) { //doc refers to selected campground
    if (doc) {
        await Review.deleteMany({ //delete all review
            _id: {              //where their id field
                $in: doc.reviews//is in the doc that was just deleted in the reviews array
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampGroundSchema);