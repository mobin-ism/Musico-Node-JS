const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required()
});

function validate(user) {
    return Joi.validate(user, schema);
}

module.exports.validate = validate;