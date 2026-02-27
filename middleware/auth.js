const jwt = require('jsonwebtoken');

/**
 * Middleware: verify JWT Bearer token.
 * Attaches decoded payload { id, username, role } to req.user.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'No token provided. Access denied.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Token expired. Please login again.' });
        }
        return res.status(401).json({ success: false, error: 'Invalid token.' });
    }
};

/**
 * Generate a signed JWT token for the given payload.
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
};

module.exports = { authenticate, generateToken };
