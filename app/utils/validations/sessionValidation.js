const joi = require('joi');


const sessionShema = joi.object({
    dateTime: joi.date().min('now').required(),
    price: joi.number().min(10).required(),
    room: joi.string().alphanum().required(),
    movie:joi.string().alphanum().required(),
    sessionId:joi.string().allow('').optional()

});

exports.validatSession = (sessiondata) => {
    return sessionShema.validate(sessiondata);
};