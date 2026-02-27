/**
 * Global Express error handler.
 * Must be registered LAST in server.js (after all routes).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Log the full error in development
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }

    // Mongoose validation error → 400
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, error: messages.join(', ') });
    }

    // Mongoose bad ObjectId → 400
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, error: `Invalid ${err.path}: ${err.value}` });
    }

    // MongoDB duplicate key → 409
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res
            .status(409)
            .json({ success: false, error: `${field} already exists.` });
    }

    // JWT errors (shouldn't normally reach here — handled in auth middleware)
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, error: 'Invalid token.' });
    }

    // Default 500
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
