const passport = require('passport');



const campIsLogin = (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
        next();
    } else {
        // console.log(req.originalUrl);
        // from camp edit
        req.session.url = req.originalUrl;
        // from new review
        // req.session.url = req.originalUrl.slice(0, -6);
        // console.log(req.session.url);
        req.flash('error', 'You must be signed in first!')
        res.redirect('/login');
    }
}





const reviewIsLogin = (req, res, next) => {

    if (req.isAuthenticated()) {
        next();
    } else {
        // console.log(req.originalUrl);
        // from camp edit
        // req.session.url = req.originalUrl;
        // from new review
        req.session.url = req.originalUrl.slice(0, -6);
        // console.log(req.session.url);
        req.flash('error', 'You must be signed in first!')
        res.redirect('/login');
    }
}


const reviewDeleteIsLogin = (req, res, next) => {

    if (req.isAuthenticated()) {
        next();
    } else {
        // console.log(req.originalUrl);
        // from camp edit
        // req.session.url = req.originalUrl;
        // from new review
        const index = req.originalUrl.indexOf('review');
        req.session.url = req.originalUrl.slice(0, index);
        // console.log(req.session.url);
        req.flash('error', 'You must be signed in first!')
        res.redirect('/login');
    }
}




module.exports = { reviewIsLogin, campIsLogin, reviewDeleteIsLogin };