/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'Duplicate entry',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Sequelize foreign key constraint errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            error: 'Invalid reference',
            message: 'Referenced record does not exist'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
};

/**
 * 404 handler
 */
const notFound = (req, res) => {
    res.status(404).json({ error: 'Route not found' });
};

module.exports = { errorHandler, notFound };
