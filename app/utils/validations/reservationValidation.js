const joi = require('joi');


const reservationShema = joi.object({
    seats: joi.number().min(1).required(),
    session:joi.string().alphanum().required(),
});

exports.validateReservation = (reservationdata) => {
    return reservationShema.validate(reservationdata);
};