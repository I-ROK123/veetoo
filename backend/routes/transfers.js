const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { InventoryTransfer, Store, Product, User, StoreInventory } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Generate unique transfer number
 */
const generateTransferNumber = async () => {
    const date = new Date();
    const prefix = `TRF-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const count = await InventoryTransfer.count({
        where: {
            transfer_number: {
                [sequelize.Sequelize.Op.like]: `${prefix}%`
            }
        }
    });
    return `${prefix}-${String(count + 1).padStart(4, '0')}`;
};

/**
 * @route   GET /api/transfers
 * @desc    Get all transfers with filters
 * @access  Private
 */
router.get('/', [
    query('status').optional().isIn(['pending', 'in_transit', 'completed', 'cancelled']),
    query('from_store_id').optional().isUUID(),
    query('to_store_id').optional().isUUID(),
    query('product_id').optional().isUUID()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status, from_store_id, to_store_id, product_id } = req.query;

        const where = {};
        if (status) where.status = status;
        if (from_store_id) where.from_store_id = from_store_id;
        if (to_store_id) where.to_store_id = to_store_id;
        if (product_id) where.product_id = product_id;

        const transfers = await InventoryTransfer.findAll({
            where,
            include: [
                {
                    model: Store,
                    as: 'fromStore',
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Store,
                    as: 'toStore',
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Product,
                    attributes: ['id', 'name', 'sku', 'category']
                },
                {
                    model: User,
                    as: 'requester',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'approver',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'completer',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['requested_date', 'DESC']]
        });

        res.json({ transfers });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/transfers/:id
 * @desc    Get transfer by ID
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
    try {
        const transfer = await InventoryTransfer.findByPk(req.params.id, {
            include: [
                {
                    model: Store,
                    as: 'fromStore',
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Store,
                    as: 'toStore',
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Product,
                    attributes: ['id', 'name', 'sku', 'category', 'unit_price']
                },
                {
                    model: User,
                    as: 'requester',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'approver',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'completer',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!transfer) {
            return res.status(404).json({ error: 'Transfer not found' });
        }

        res.json({ transfer });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/transfers
 * @desc    Create transfer request
 * @access  Private (Supervisor/CEO)
 */
router.post('/', authorize('supervisor', 'ceo'), [
    body('from_store_id').isUUID().withMessage('Valid from store ID is required'),
    body('to_store_id').isUUID().withMessage('Valid to store ID is required'),
    body('product_id').isUUID().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('notes').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { from_store_id, to_store_id, product_id, quantity, notes } = req.body;

        // Validate stores exist
        const fromStore = await Store.findByPk(from_store_id);
        const toStore = await Store.findByPk(to_store_id);

        if (!fromStore || !toStore) {
            return res.status(404).json({ error: 'One or both stores not found' });
        }

        if (from_store_id === to_store_id) {
            return res.status(400).json({ error: 'Cannot transfer to the same store' });
        }

        // Check if source store has enough stock
        const inventory = await StoreInventory.findOne({
            where: { store_id: from_store_id, product_id }
        });

        if (!inventory || inventory.quantity_in_stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock in source store' });
        }

        // Generate transfer number
        const transfer_number = await generateTransferNumber();

        const transfer = await InventoryTransfer.create({
            transfer_number,
            from_store_id,
            to_store_id,
            product_id,
            quantity,
            status: 'pending',
            requested_by: req.user.id,
            requested_date: new Date(),
            notes
        });

        res.status(201).json({
            message: 'Transfer request created successfully',
            transfer
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/transfers/:id/approve
 * @desc    Approve transfer and move to in_transit
 * @access  Supervisor/CEO
 */
router.put('/:id/approve', authorize('supervisor', 'ceo'), async (req, res, next) => {
    try {
        const transfer = await InventoryTransfer.findByPk(req.params.id);

        if (!transfer) {
            return res.status(404).json({ error: 'Transfer not found' });
        }

        if (transfer.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending transfers can be approved' });
        }

        await transfer.update({
            status: 'in_transit',
            approved_by: req.user.id,
            approved_date: new Date()
        });

        res.json({
            message: 'Transfer approved successfully',
            transfer
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/transfers/:id/complete
 * @desc    Complete transfer and update inventory
 * @access  Supervisor/CEO
 */
router.put('/:id/complete', authorize('supervisor', 'ceo'), async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const transfer = await InventoryTransfer.findByPk(req.params.id, { transaction });

        if (!transfer) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Transfer not found' });
        }

        if (transfer.status !== 'in_transit') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Only in-transit transfers can be completed' });
        }

        // Decrease stock from source store
        const fromInventory = await StoreInventory.findOne({
            where: { store_id: transfer.from_store_id, product_id: transfer.product_id },
            transaction
        });

        if (!fromInventory || fromInventory.quantity_in_stock < transfer.quantity) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Insufficient stock in source store' });
        }

        await fromInventory.update({
            quantity_in_stock: fromInventory.quantity_in_stock - transfer.quantity
        }, { transaction });

        // Increase stock in destination store
        const [toInventory] = await StoreInventory.findOrCreate({
            where: { store_id: transfer.to_store_id, product_id: transfer.product_id },
            defaults: {
                quantity_in_stock: 0,
                reorder_level: 10
            },
            transaction
        });

        await toInventory.update({
            quantity_in_stock: toInventory.quantity_in_stock + transfer.quantity
        }, { transaction });

        // Update transfer status
        await transfer.update({
            status: 'completed',
            completed_by: req.user.id,
            completed_date: new Date()
        }, { transaction });

        await transaction.commit();

        res.json({
            message: 'Transfer completed successfully',
            transfer
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
});

/**
 * @route   PUT /api/transfers/:id/cancel
 * @desc    Cancel transfer
 * @access  Supervisor/CEO
 */
router.put('/:id/cancel', authorize('supervisor', 'ceo'), async (req, res, next) => {
    try {
        const transfer = await InventoryTransfer.findByPk(req.params.id);

        if (!transfer) {
            return res.status(404).json({ error: 'Transfer not found' });
        }

        if (transfer.status === 'completed') {
            return res.status(400).json({ error: 'Cannot cancel completed transfers' });
        }

        await transfer.update({ status: 'cancelled' });

        res.json({
            message: 'Transfer cancelled successfully',
            transfer
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
