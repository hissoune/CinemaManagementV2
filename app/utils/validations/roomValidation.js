const joi = require('joi')


const roomshema = joi.object({
    name: joi.string().min(5).max(15).required(),
    capacity:joi.number().min(1).max(100),
    location:joi.string(),
    location:joi.string(),
    roomId: joi.string().allow('').optional(),

})

exports.validateRoom = (roomdata) => {
    return roomshema.validate(roomdata);
}