const Joi = require('joi');

// Like Laravel validation rules for register
const registerSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name connot exceed 50 characters",
            "any.required": "Name is required"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "please provide a valid email",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 100 characters",
            "any.required": "Password is required"
        }),
});

// Like Laravel validation rules for login

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "please provide a valid email",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 100 characters",
            "any.required": "Password is required"
        }),
});

module.exports = { registerSchema, loginSchema };