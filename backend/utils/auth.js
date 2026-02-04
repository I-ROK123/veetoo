const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Hash a password
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
    } catch (error) {
        return null;
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};
