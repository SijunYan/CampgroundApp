const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');

const Campground = require('./models/campground.js');
const Review = require('./models/review.js');
const { date } = require('joi');



const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
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
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// connect database
async function main() {
    await mongoose.connect('mongodb://localhost:27017/campground');
}
main()
    .then(() => console.log('Database connected!!!!'))
    .catch(err => console.log(err));

//listen port 3000
app.listen(3000, () => {
    console.log('server is listen on port 3000!')
});


// Server-side Validation Middleware
// validation for new campground
function validation(req, res, next) {
    const validationSchema = Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().min(0).required(),
        image: Joi.string()
    });
    const result = validationSchema.validate(req.body);
    if (result.error) {
        console.log(`????????????????????????????`);
        console.log(result.error);
        console.log(`????????????????????????????`);
        throw new Error(result.error);
    }
    else next();
}

// validation for new review
function reviewValidate(req, res, next) {
    const reviewValidateSchema = Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required()
    });
    const result = reviewValidateSchema.validate(req.body);
    if (result.error) {
        console.log(result.error);
        throw new Error(result.error)
    }
    else next();
}




// RESTful API

app.get('/', (req, res) => {
    throw new Error('please go to "/campgrounds"');
});


// Index
app.get('/campgrounds', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find();
        console.log('Display index');
        res.render('campgrounds/index', { campgrounds, });
    } catch (e) {
        next(e)
    }
});




//Add new , put it ahead as it will collide with '/campgrounds/:id'
app.get('/campgrounds/new', (req, res) => {
    console.log('add new');
    res.render('campgrounds/new');
});

app.post('/campgrounds', validation, async (req, res, next) => {
    try {
        console.log('post the data');
        console.log(req.body);


        const newCamp = new Campground(req.body);
        await newCamp.save();
        res.redirect(`/campgrounds/${newCamp._id}`);
    } catch (e) {
        next(e)
    }
});

// show page
app.get('/campgrounds/:id', async (req, res, next) => {
    try {
        // console.log(`request for id ${req.params.id}`);
        const campground = await Campground.findById(req.params.id).populate('reviews');
        console.log(campground);
        res.render('campgrounds/show', { campground });
    } catch (err) {
        console.log(`-----------------------${err}----------------------`);
        next(new Error('Can not find the data from show page!!!'));
    }

});

// Review
app.post('/campgrounds/:id/review', reviewValidate, async (req, res, next) => {
    try {
        // console.log(`request for id ${req.params.id}`);
        // console.log(`post review`);
        // console.log(req.body);
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body);
        campground.reviews.push(review);
        // console.log(campground);
        await review.save();
        await campground.save();
        req.flash('success', 'Post a new review successfully!')
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err) {
        console.log(`-----------------------${err}----------------------`);
        next(new Error('Can not post the review!!!'));
    }

});


// Edit

app.get('/campgrounds/:id/edit', async (req, res, next) => {
    console.log(`edit ${req.params.id}`);
    // const camp = await 
    Campground.findById(req.params.id)
        .then(camp => {
            res.render('campgrounds/edit', { camp });
        })
        .catch(err => {
            console.log(`-----------------------${err}----------------------`);
            next(new Error('Can not find the data from edit page!!!'));
        });
});

app.patch('/campgrounds/:id', validation, async (req, res, next) => {
    console.log(`Patch Id: ${req.params.id}`);
    console.log(req.body);
    Campground.findByIdAndUpdate(req.params.id, req.body)
        .then(editedCamp => {
            res.redirect(`/campgrounds/${editedCamp._id}`);
        })
        .catch(e => {
            next(e)
        })

});

//Delete
app.delete('/campgrounds/:id', async (req, res, next) => {
    try {
        console.log(`Delete Id: ${req.params.id}`);
        const query = await Campground.findByIdAndDelete(req.params.id).populate('reviews');
        // A post midlleware triggered by findOneAndDelete

        // Alternative solution:
        // for (let q of query.reviews) {
        //     await Review.findByIdAndDelete(q._id);
        // };
        console.log(`done! all data in **${query.title}** deleted!!`);
        res.redirect('/campgrounds');
    } catch (err) {
        console.log(err)
        next(err);
    }
});


app.delete('/campgrounds/:campId/review/:revId', async (req, res, next) => {
    try {
        console.log(`Delete Id:`);
        console.log(req.params);
        await Campground.findOneAndUpdate({ _id: req.params.campId }, { $pull: { reviews: { _id: req.params.revId } } });
        await Review.findByIdAndDelete(req.params.revId);
        console.log(`deleted!!`);
        req.flash('success', 'Deleted successfully!')
        res.redirect(`/campgrounds/${req.params.campId}`);
    } catch (err) {
        console.log(err)
        next(err);
    }
});


// Error Handler
app.use((err, req, res, next) => {
    if (!err.message) err.message = 'Have a bad problem!';
    res.render('campgrounds/error', { err });

});
