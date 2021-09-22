
const Campground = require('../models/campground');
const Review = require('../models/review');

const isCampAuthor = async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    // console.log('------------------------')
    // console.log(camp.author)
    // console.log(req.user)
    if (camp.author.equals(req.user._id)) {
        next();
    }
    else {
        req.flash('error', 'Sorry, you are not the author');
        res.redirect(`/campgrounds/${req.params.id}`);
    }
}


const isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.revId)
    if (review.author.equals(req.user._id)) {
        next();
    }
    else {
        req.flash('error', 'Sorry, you are not the author');
        res.redirect(`/campgrounds/${req.params.campId}`);
    }
}


module.exports = { isCampAuthor, isReviewAuthor };