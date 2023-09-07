const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    fileName: String
});


//VIRTUAL PROPERTY TO replace url to make img look thumbnail in edit page
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true} }; //use this to include the new virtual pop up to properties

const CampGroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

//VIRTUAL PROPERTY for popup
CampGroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
 
    <a href="/campgrounds/${this._id}"><strong>${this.title}</strong></a>
    <p>${this.description.substring(0,80)}...</p>
    `
});

// query middleware for delete reviews when campground  is deleted
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