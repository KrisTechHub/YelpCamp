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
        const price = Math.floor(Math.random() * 50) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://unsplash.com/photos/uMBjWsbL_4A',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nisi magnam assumenda impedit itaque doloribus animi earum placeat debitis laboriosam neque odit maxime, quisquam quidem tenetur deserunt quae error dolor, iste ullam et officiis quis. Labore dignissimos voluptatibus assumenda, velit rem pariatur eligendi sapiente optio nam omnis cumque molestias excepturi odio numquam adipisci alias atque voluptates porro eveniet, error qui molestiae, repellendus nisi quis? Inventore, delectus similique, asperiores provident temporibus perferendis amet id dolores mollitia debitis ducimus sit accusamus quaerat autem repudiandae. Delectus, officia voluptas tenetur nemo architecto officiis nihil, velit et quis fugit maiores quod corrupti assumenda illo! Cumque.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})