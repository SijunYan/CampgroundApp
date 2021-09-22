const User = require('../models/user');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

module.exports.newReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Post a new review successfully!')
    res.redirect(`/campgrounds/${req.params.id}`);
}


module.exports.editReview = async (req, res, next) => {
    await Campground.findOneAndUpdate({ _id: req.params.campId }, { $pull: { reviews: { _id: req.params.revId } } });
    await Review.findByIdAndDelete(req.params.revId);
    req.flash('success', 'Deleted successfully!')
    res.redirect(`/campgrounds/${req.params.campId}`);
}