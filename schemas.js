const Joi = require('joi');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.campSchema = Joi.object({ //Validate data on the server side before we post it to mongoose database
    campground: Joi.object({ //1. define schema
        title: Joi.string()
            .required()
            .escapeHTML(),
        price: Joi.number()
            .required()
            .min(0),
        // image: Joi.string()
        //     .required(),
        location: Joi.string()
            .required()
            .escapeHTML(),
        description: Joi.string()
            .required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),
        body: Joi.string()
            .required()
            .escapeHTML()
    }).required()
});