const express = require('express');
const { body, validationResult } = require('express-validator');
const { Store, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/stores
 * @desc    Get all stores
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const stores = await Store.findAll({
            include: [
                {
                    model: User,
                    as: 'manager',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['name', 'ASC']]
        });

        res.json({ stores });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/stores/:id
 * @desc    Get store by ID
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
    try {
        const store = await Store.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'manager',
                    attributes: ['id', 'name', 'email', 'phone_number']
                }
            ]
        });

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.json({ store });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/stores
 * @desc    Create a new store
 * @access  CEO only
 */
router.post('/', authorize('ceo', 'supervisor'), [
    body('name').trim().notEmpty().withMessage('Store name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('manager_id').optional().isUUID().withMessage('Invalid manager ID'),
    body('phone_number').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, location, manager_id, phone_number } = req.body;

        // Verify manager exists if provided
        if (manager_id) {
            const manager = await User.findByPk(manager_id);
            if (!manager) {
                return res.status(404).json({ error: 'Manager not found' });
            }
        }

        const store = await Store.create({
            name,
            location,
            manager_id,
            phone_number
        });

        res.status(201).json({
            message: 'Store created successfully',
            store
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/stores/:id
 * @desc    Update store
 * @access  CEO/Supervisor
 */
router.put('/:id', authorize('ceo', 'supervisor'), [
    body('name').optional().trim().notEmpty(),
    body('location').optional().trim().notEmpty(),
    body('manager_id').optional().isUUID(),
    body('phone_number').optional().trim(),
    body('is_active').optional().isBoolean()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const store = await Store.findByPk(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const { name, location, manager_id, phone_number, is_active } = req.body;

        // Verify manager exists if provided
        if (manager_id) {
            const manager = await User.findByPk(manager_id);
            if (!manager) {
                return res.status(404).json({ error: 'Manager not found' });
            }
        }

        await store.update({
            ...(name && { name }),
            ...(location && { location }),
            ...(manager_id !== undefined && { manager_id }),
            ...(phone_number !== undefined && { phone_number }),
            ...(is_active !== undefined && { is_active })
        });

        res.json({
            message: 'Store updated successfully',
            store
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/stores/:id
 * @desc    Deactivate store
 * @access  CEO only
 */
router.delete('/:id', authorize('ceo'), async (req, res, next) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        await store.update({ is_active: false });

        res.json({ message: 'Store deactivated successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
