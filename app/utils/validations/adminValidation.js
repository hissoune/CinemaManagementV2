const joi = require('joi')



exports.adminValidation = joi.object({
    name: joi.string().alphanum().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),

    
})

