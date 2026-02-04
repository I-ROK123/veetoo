const { verifyToken } = require('../utils/auth');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT token
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Fetch user from database
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user || !user.is_active) {
            return res.status(401).json({ error: 'User not found or inactive' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

/**
 * Middleware to check if user has required role
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

module.exports = { authenticate, authorize };
