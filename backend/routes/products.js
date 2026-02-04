const express = require('express');
const { body, validationResult } = require('express-validator');
const { Product, StoreInventory, Store } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: StoreInventory,
                    include: [
                        {
                            model: Store,
                            attributes: ['id', 'name', 'location']
                        }
                    ]
                }
            ],
            order: [['name', 'ASC']]
        });

        res.json({ products });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: StoreInventory,
                    include: [
                        {
                            model: Store,
                            attributes: ['id', 'name', 'location']
                        }
                    ]
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Supervisor/CEO
 */
router.post('/', authorize('supervisor', 'ceo'), [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('description').optional().trim(),
    body('image_url').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, sku, category, unit_price, description, image_url } = req.body;

        const product = await Product.create({
            name,
            sku,
            category,
            unit_price,
            description,
            image_url
        });

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Supervisor/CEO
 */
router.put('/:id', authorize('supervisor', 'ceo'), [
    body('name').optional().trim().notEmpty(),
    body('sku').optional().trim().notEmpty(),
    body('category').optional().trim().notEmpty(),
    body('unit_price').optional().isFloat({ min: 0 }),
    body('description').optional().trim(),
    body('image_url').optional().trim(),
    body('is_active').optional().isBoolean()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { name, sku, category, unit_price, description, image_url, is_active } = req.body;

        await product.update({
            ...(name && { name }),
            ...(sku && { sku }),
            ...(category && { category }),
            ...(unit_price !== undefined && { unit_price }),
            ...(description !== undefined && { description }),
            ...(image_url !== undefined && { image_url }),
            ...(is_active !== undefined && { is_active })
        });

        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Deactivate product
 * @access  CEO
 */
router.delete('/:id', authorize('ceo'), async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.update({ is_active: false });

        res.json({ message: 'Product deactivated successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
