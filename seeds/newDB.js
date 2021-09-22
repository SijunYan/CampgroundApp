// create a collection in database


const mongoose = require('mongoose');
const Campground = require('../models/campground.js')
const cities = require('./cities.js');
const { descriptors, places } = require('./seedHelpers.js');


// connect database
async function main() {
    await mongoose.connect('mongodb://localhost:27017/campground');
}
main()
    .then(() => console.log('Database connected!!!!'))
    .catch(err => console.log(err));

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]}${places[Math.floor(Math.random() * places.length)]}`,
            image: 'https://source.unsplash.com/collection/72876353',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat suscipit maiores quae aliquid. Maiores recusandae vel totam. Laborum consequuntur, quidem doloremque nesciunt accusamus amet, error sed dolor voluptates mollitia non?',
            price: Math.floor(Math.random() * 20) + 10,
            author: '6149310d96f5db227c5e06d3'
        });
        await camp.save();
    }
};

seedDB()
    .then(() => { mongoose.connection.close(); });

