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

const updateDB = async () => {
    camp = await Campground.findById('614947fbcc09b1a580a456fe');
    console.log(camp);
};

updateDB()
    .then(() => { mongoose.connection.close(); });

