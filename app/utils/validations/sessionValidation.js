const joi = require('joi');


const sessionShema = joi.object({
    dateTime: joi.date().min('now').required(),
    price: joi.number().min(10).max(200).required(),
    room: joi.string().alphanum().required(),
    movie:joi.string().alphanum().required(),
});

exports.validatSession = (sessiondata) => {
    return sessionShema.validate(sessiondata);
};