
const Joi = require('joi');

// Server-side Validation Middleware
// validation for new campground
const newCampValidate = (req, res, next) => {
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


module.exports = { reviewValidate, newCampValidate };