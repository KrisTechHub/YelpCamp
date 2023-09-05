const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp'); // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    console.log("connected to mongo");
}

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dwe0pltoe/image/upload/v1693924500/YelpCamp/csvm5gdp8tov7hvpel5y.jpg',
                    fileName: 'YelpCamp/csvm5gdp8tov7hvpel5y'
                },
                {
                    url: 'https://res.cloudinary.com/dwe0pltoe/image/upload/v1693924500/YelpCamp/g9hlmtitncqnv6qhd00z.jpg',
                    fileName: 'YelpCamp/g9hlmtitncqnv6qhd00z'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price,
            author: '64f1dc72283396db8de58cc5'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})