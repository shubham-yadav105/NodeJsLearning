const Joi = require('joi');

// Like Laravel validation rules for creating a user
const createUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.min": "Name must be at least 3 characters",
            "any.required": "Name is required"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Please provide a valid email",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        })
});

// Like Laravel validation rules for updating a user
const updateUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .messages({
            "string.min": "Name must be at least 3 characters",
        }),
    email: Joi.string()
        .email()
        .messages({
            "string.email": "please provide a valid email",
        }),
}).min(1); /// at least one field required - like 'sometimes' in laravel

module.exports = { createUserSchema, updateUserSchema };

