const Joi = require("joi");

// Like Laravel validation rules for creating a post

const createPostSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            "string.min": "Title must be at least 3 characters",
            'string.max': "Title cannot exceed 255 characters"
        }),
    body: Joi.string()
        .min(10)
        .required()
        .messages({
            "string.min": "Body must be at least 10 characters",
            "any.required": "Body is required"
        }),
});

const updatePostSchema = Joi.object({
    title: Joi.string().min(3).max(255),
    body: Joi.string().min(10),
}).min(1); // at least one field required - like 'sometimes' in laravel 

module.exports = { createPostSchema, updatePostSchema };