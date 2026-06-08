// This is like Laravel's FormRequest - reusable validation middleware

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        // abortEarly: false = show ALL errors at once, like Laravel does

        if (error) {
            const errors = error.details.map(err => ({
                field: err.path[0],       // which field failed
                message: err.message      // why it failed
            }));

            return res.status(422).json({
                message: "Validation failed",
                errors  // like $validator->errors() in Laravel
            });
        }

        next(); // validation passed, move to controller
    };
};

module.exports = validate;