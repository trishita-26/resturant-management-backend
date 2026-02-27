const Joi = require('joi');

const createMenuSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    taste: Joi.string().valid('Sweet', 'Spicy', 'Sour'),
    is_drink: Joi.boolean().default(false),
    ingredients: Joi.array().items(Joi.string()).default([]),
    num_sales: Joi.number().integer().min(0).default(0),
});

const updateMenuSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    price: Joi.number().min(0),
    taste: Joi.string().valid('Sweet', 'Spicy', 'Sour'),
    is_drink: Joi.boolean(),
    ingredients: Joi.array().items(Joi.string()),
    num_sales: Joi.number().integer().min(0),
}).min(1); // at least one field required for update

module.exports = { createMenuSchema, updateMenuSchema };
