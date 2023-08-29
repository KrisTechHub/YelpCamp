const Joi = require('joi');

module.exports.campSchema = Joi.object({ //Validate data on the server side before we post it to mongoose database
        campground: Joi.object({ //1. define schema
            title: Joi.string()
                .required(),
            price: Joi.number()
                .required()
                .min(0),
            image: Joi.string()
                .required(),
            location: Joi.string()
                .required(),
            description: Joi.string()
            .required()
        }).required()
    })