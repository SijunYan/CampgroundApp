const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');

const Campground = require('./models/campground.js');
const Review = require('./models/review.js');
const User = require('./models/user.js')

const userRoutes = require('./routes/userRoutes');
const campRoutes = require('./routes/campRoutes');
const reviewRoutes = require('./routes/reviewRoutes');




const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session  -  flash, passport session, local
app.use(session({
    secret: 'ItIsASecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    // console.log('*************URL******************')
    // console.log(res.locals.currentUser);
    next();
});


// connect database
async function main() {
    await mongoose.connect('mongodb://localhost:27017/campground');
}
main()
    .then(() => console.log('Database connected!!!!'))
    .catch(err => console.log(err));

// Routes
app.use('/', userRoutes);
app.use('/campgrounds', campRoutes);
app.use('/', reviewRoutes);

// Root

app.get('/', (req, res) => {
    throw new Error('please go to "/campgrounds"');
});


// Error Handler
app.use((err, req, res, next) => {
    if (!err.message) err.message = 'Have a bad problem!';
    res.render('campgrounds/error', { err });

});


//listen port 3000
app.listen(3000, () => {
    console.log('server is listen on port 3000!')
});