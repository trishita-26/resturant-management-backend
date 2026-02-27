/**
 * Middleware factory for Joi schema validation.
 *
 * Usage:
 *   validate(mySchema)              // validates req.body (default)
 *   validate(mySchema, 'params')    // validates req.params
 *   validate(mySchema, 'query')     // validates req.query
 */
const validate = (schema, target = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[target], { abortEarly: false });

        if (error) {
            const messages = error.details.map((d) => d.message.replace(/"/g, "'"));
            return res.status(400).json({ success: false, error: messages.join('; ') });
        }

        // Replace the target with the sanitized/cast value from Joi
        req[target] = value;
        next();
    };
};

module.exports = validate;
