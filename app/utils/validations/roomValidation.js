const joi = require('joi')


const roomshema = joi.object({
    name: joi.string().min(5).max(15).required(),
    capacity:joi.number().min(1).max(100),
})

exports.validateRoom = (roomdata) => {
    return roomshema.validate(roomdata);
}