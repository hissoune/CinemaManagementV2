const joi = require('joi');


const sessionShema = joi.object({
    dateTime: Joi.date().min('now').required(),
    price: joi.number().min(10).max(200).required(),
});

exports.validatSession = (sessiondata) => {
    return sessionShema.validate(sessiondata);
};