const mongoose = require('mongoose');
const Review = require('./review.js');

const campgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]

});

campgroundSchema.post('findOneAndDelete', async function (data) {
    console.log(data);

    for (let q of data.reviews) {
        await Review.findByIdAndDelete(q._id);
    };
    console.log('Done! reviews deleted!!');

})



module.exports = mongoose.model('Campground', campgroundSchema);