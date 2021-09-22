const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Campground = require('../models/campground.js');
const { newCampValidate } = require('../utilities/validate.js');
const { campIsLogin } = require('../utilities/isLogin');
const { isCampAuthor } = require('../utilities/isAuthor')
const wrapAsync = require('../utilities/wrapAsync')


const router = express.Router();

// Index
router.get('/', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find();
        // console.log('Display index');
        res.render('campgrounds/index', { campgrounds, });
    } catch (e) {
        next(e)
    }
});




//Add new , put it ahead as it will collide with '/campgrounds/:id'
router.get('/new', campIsLogin, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', campIsLogin, newCampValidate, wrapAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body);
    newCamp.author = req.user._id;
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));


// show page
router.get('/:id', wrapAsync(async (req, res, next) => {
    // store url for navbar login redirect
    req.session.url = req.originalUrl;
    const campground = await Campground.findById(req.params.id).populate('author').populate({ path: 'reviews', populate: { path: 'author' } });
    res.render('campgrounds/show', { campground });
}));


// Edit

router.get('/:id/edit', campIsLogin, isCampAuthor, wrapAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp });
}));

router.patch('/:id', campIsLogin, isCampAuthor, newCampValidate, wrapAsync(async (req, res, next) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/campgrounds/${req.params.id}`);
}));

//Delete
router.delete('/:id', campIsLogin, isCampAuthor, wrapAsync(async (req, res, next) => {

    // A post midlleware triggered by findOneAndDelete to delete child objects
    const query = await Campground.findByIdAndDelete(req.params.id).populate('reviews');
    // Alternative solution:
    // for (let q of query.reviews) {
    //     await Review.findByIdAndDelete(q._id);
    // };
    res.redirect('/campgrounds');

}));


module.exports = router;