const Joi = require('joi');

const signupSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    age: Joi.number().integer().min(18).max(80),
    work: Joi.string().valid('chef', 'waiter', 'manager').required(),
    mobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({ 'string.pattern.base': 'Mobile must be a 10-digit number' }),
    email: Joi.string().email().required(),
    address: Joi.string().max(250),
    salary: Joi.number().min(0).required(),
    username: Joi.string().alphanum().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const updatePersonSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    age: Joi.number().integer().min(18).max(80),
    work: Joi.string().valid('chef', 'waiter', 'manager'),
    mobile: Joi.string().pattern(/^[0-9]{10}$/),
    email: Joi.string().email(),
    address: Joi.string().max(250),
    salary: Joi.number().min(0),
    username: Joi.string().alphanum().min(3).max(50),
}).min(1); // at least one field required for update

module.exports = { signupSchema, loginSchema, updatePersonSchema };
