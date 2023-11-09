const {Joi} = require("express-validation");

const fetch = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

const create = {
    body: Joi.object({
        firstName: Joi.string().max(50).required(),
        lastName: Joi.string().max(50).required(),
        countryCode: Joi.string().max(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().max(100).required()
    })
};

const remove = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

module.exports = {
    fetch,
    create,
    remove
};
