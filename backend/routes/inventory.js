const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { StoreInventory, Store, Product, StockTransaction, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/inventory
 * @desc    Get inventory across all stores or filtered
 * @access  Private
 */
router.get('/', [
    query('store_id').optional().isUUID(),
    query('product_id').optional().isUUID(),
    query('low_stock').optional().isBoolean()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { store_id, product_id, low_stock } = req.query;

        const where = {};
        if (store_id) where.store_id = store_id;
        if (product_id) where.product_id = product_id;

        let inventory = await StoreInventory.findAll({
            where,
            include: [
                {
                    model: Store,
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Product,
                    attributes: ['id', 'name', 'sku', 'category', 'unit_price']
                }
            ],
            order: [[Store, 'name', 'ASC'], [Product, 'name', 'ASC']]
        });

        // Filter low stock if requested
        if (low_stock === 'true') {
            inventory = inventory.filter(item => item.quantity_in_stock <= item.reorder_level);
        }

        res.json({ inventory });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/inventory/store/:storeId
 * @desc    Get inventory for specific store
 * @access  Private
 */
router.get('/store/:storeId', async (req, res, next) => {
    try {
        const inventory = await StoreInventory.findAll({
            where: { store_id: req.params.storeId },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'sku', 'category', 'unit_price', 'image_url']
                }
            ],
            order: [[Product, 'name', 'ASC']]
        });

        res.json({ inventory });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/inventory/product/:productId
 * @desc    Get product inventory across all stores
 * @access  Private
 */
router.get('/product/:productId', async (req, res, next) => {
    try {
        const inventory = await StoreInventory.findAll({
            where: { product_id: req.params.productId },
            include: [
                {
                    model: Store,
                    attributes: ['id', 'name', 'location']
                }
            ],
            order: [[Store, 'name', 'ASC']]
        });

        res.json({ inventory });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/inventory/adjust
 * @desc    Adjust inventory (stock in/out)
 * @access  Private (Supervisor/CEO)
 */
router.post('/adjust', authorize('supervisor', 'ceo'), [
    body('store_id').isUUID().withMessage('Valid store ID is required'),
    body('product_id').isUUID().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('type').isIn(['in', 'out']).withMessage('Type must be "in" or "out"'),
    body('sales_person_id').optional().isUUID(),
    body('notes').optional().trim()
], async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(400).json({ errors: errors.array() });
        }

        const { store_id, product_id, quantity, type, sales_person_id, notes } = req.body;

        // Find or create inventory record
        let [inventory] = await StoreInventory.findOrCreate({
            where: { store_id, product_id },
            defaults: {
                quantity_in_stock: 0,
                reorder_level: 10
            },
            transaction
        });

        // Calculate new quantity
        const currentStock = inventory.quantity_in_stock;
        const newStock = type === 'in' ? currentStock + quantity : currentStock - quantity;

        if (newStock < 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Insufficient stock for this operation' });
        }

        // Update inventory
        await inventory.update({ quantity_in_stock: newStock }, { transaction });

        // Create stock transaction record
        await StockTransaction.create({
            store_id,
            product_id,
            quantity,
            type,
            sales_person_id,
            notes,
            created_by: req.user.id,
            date: new Date()
        }, { transaction });

        await transaction.commit();

        res.json({
            message: 'Inventory adjusted successfully',
            inventory: {
                ...inventory.toJSON(),
                previous_stock: currentStock,
                new_stock: newStock
            }
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
});

/**
 * @route   GET /api/inventory/low-stock
 * @desc    Get low stock items across all stores
 * @access  Private
 */
router.get('/low-stock', async (req, res, next) => {
    try {
        const inventory = await StoreInventory.findAll({
            where: sequelize.where(
                sequelize.col('quantity_in_stock'),
                '<=',
                sequelize.col('reorder_level')
            ),
            include: [
                {
                    model: Store,
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Product,
                    attributes: ['id', 'name', 'sku', 'category', 'unit_price']
                }
            ],
            order: [[Store, 'name', 'ASC'], [Product, 'name', 'ASC']]
        });

        res.json({ inventory, count: inventory.length });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
