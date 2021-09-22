const express = require('express');
const passport = require('passport');

const { reviewIsLogin, reviewDeleteIsLogin } = require('../utilities/isLogin');
const { reviewValidate } = require('../utilities/validate.js');
const { isReviewAuthor } = require('../utilities/isAuthor');
const wrapAsync = require('../utilities/wrapAsync');
const reviews = require('../controllers/reviews')


const router = express.Router();

router.post('/campgrounds/:id/review', reviewIsLogin, reviewValidate, wrapAsync(reviews.newReview));

router.delete('/campgrounds/:campId/review/:revId', reviewDeleteIsLogin, isReviewAuthor, wrapAsync(reviews.editReview));

module.exports = router;