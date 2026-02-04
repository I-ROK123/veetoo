const express = require('express');
const { query, validationResult } = require('express-validator');
const {
    Invoice,
    InvoicePayment,
    User,
    StoreInventory,
    Store,
    Product,
    InventoryTransfer,
    Debt,
    StockTransaction
} = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/reports/dashboard/ceo
 * @desc    Get CEO dashboard metrics
 * @access  CEO only
 */
router.get('/dashboard/ceo', authorize('ceo'), async (req, res, next) => {
    try {
        // Total sales
        const totalSales = await Invoice.sum('amount', {
            where: { status: ['approved', 'cleared'] }
        }) || 0;

        // Total outstanding debts
        const totalDebts = await Debt.sum('amount', {
            where: { status: 'pending' }
        }) || 0;

        // Total inventory value
        const inventoryValue = await StoreInventory.findAll({
            include: [
                {
                    model: Product,
                    attributes: ['unit_price']
                }
            ]
        });

        const totalInventoryValue = inventoryValue.reduce((sum, item) => {
            return sum + (item.quantity_in_stock * parseFloat(item.Product.unit_price));
        }, 0);

        // Pending reconciliations
        const pendingReconciliations = await Invoice.count({
            where: {
                status: 'approved',
                reconciled: false
            }
        });

        // Pending transfers
        const pendingTransfers = await InventoryTransfer.count({
            where: { status: 'pending' }
        });

        // Low stock items
        const lowStockCount = await StoreInventory.count({
            where: sequelize.where(
                sequelize.col('quantity_in_stock'),
                '<=',
                sequelize.col('reorder_level')
            )
        });

        // Recent invoices
        const recentInvoices = await Invoice.findAll({
            limit: 10,
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name']
                }
            ],
            order: [['date', 'DESC']]
        });

        // Sales by salesperson (top 5)
        const salesBySalesperson = await Invoice.findAll({
            attributes: [
                'sales_person_id',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_sales'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'invoice_count']
            ],
            where: { status: ['approved', 'cleared'] },
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email']
                }
            ],
            group: ['sales_person_id', 'salesPerson.id'],
            order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
            limit: 5
        });

        res.json({
            metrics: {
                totalSales,
                totalDebts,
                totalInventoryValue,
                pendingReconciliations,
                pendingTransfers,
                lowStockCount
            },
            recentInvoices,
            salesBySalesperson
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/reports/reconciliation
 * @desc    Get reconciliation summary report
 * @access  Supervisor/CEO
 */
router.get('/reconciliation', authorize('supervisor', 'ceo'), [
    query('start_date').optional().isISO8601(),
    query('end_date').optional().isISO8601()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { start_date, end_date } = req.query;

        const where = {};
        if (start_date && end_date) {
            where.date = {
                [sequelize.Sequelize.Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        const reconciliationData = await Invoice.findAll({
            where,
            attributes: [
                'sales_person_id',
                [sequelize.fn('COUNT', sequelize.col('Invoice.id')), 'total_invoices'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
                [sequelize.fn('SUM', sequelize.col('total_paid')), 'total_paid'],
                [sequelize.fn('SUM', sequelize.col('balance')), 'total_balance'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN reconciled = true THEN 1 END')), 'reconciled_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN reconciled = false THEN 1 END')), 'unreconciled_count']
            ],
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email', 'region']
                }
            ],
            group: ['sales_person_id', 'salesPerson.id'],
            order: [[sequelize.fn('SUM', sequelize.col('balance')), 'DESC']]
        });

        res.json({ reconciliationData });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/reports/inventory
 * @desc    Get inventory valuation by store
 * @access  Supervisor/CEO
 */
router.get('/inventory', authorize('supervisor', 'ceo'), async (req, res, next) => {
    try {
        const inventoryByStore = await StoreInventory.findAll({
            attributes: [
                'store_id',
                [sequelize.fn('COUNT', sequelize.col('StoreInventory.id')), 'product_count'],
                [sequelize.fn('SUM', sequelize.col('quantity_in_stock')), 'total_quantity']
            ],
            include: [
                {
                    model: Store,
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Product,
                    attributes: []
                }
            ],
            group: ['store_id', 'Store.id'],
            order: [[Store, 'name', 'ASC']]
        });

        // Calculate inventory value per store
        const detailedInventory = await Promise.all(
            inventoryByStore.map(async (storeData) => {
                const items = await StoreInventory.findAll({
                    where: { store_id: storeData.store_id },
                    include: [
                        {
                            model: Product,
                            attributes: ['unit_price']
                        }
                    ]
                });

                const totalValue = items.reduce((sum, item) => {
                    return sum + (item.quantity_in_stock * parseFloat(item.Product.unit_price));
                }, 0);

                return {
                    store: storeData.Store,
                    product_count: storeData.dataValues.product_count,
                    total_quantity: storeData.dataValues.total_quantity,
                    total_value: totalValue
                };
            })
        );

        res.json({ inventoryByStore: detailedInventory });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/reports/inventory/transfers
 * @desc    Get transfer history report
 * @access  Supervisor/CEO
 */
router.get('/inventory/transfers', authorize('supervisor', 'ceo'), [
    query('start_date').optional().isISO8601(),
    query('end_date').optional().isISO8601(),
    query('status').optional().isIn(['pending', 'in_transit', 'completed', 'cancelled'])
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { start_date, end_date, status } = req.query;

        const where = {};
        if (start_date && end_date) {
            where.requested_date = {
                [sequelize.Sequelize.Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }
        if (status) where.status = status;

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
                    attributes: ['id', 'name', 'sku', 'unit_price']
                },
                {
                    model: User,
                    as: 'requester',
                    attributes: ['id', 'name']
                }
            ],
            order: [['requested_date', 'DESC']]
        });

        // Calculate total value transferred
        const totalValue = transfers.reduce((sum, transfer) => {
            if (transfer.status === 'completed') {
                return sum + (transfer.quantity * parseFloat(transfer.Product.unit_price));
            }
            return sum;
        }, 0);

        res.json({
            transfers,
            summary: {
                total_transfers: transfers.length,
                completed: transfers.filter(t => t.status === 'completed').length,
                pending: transfers.filter(t => t.status === 'pending').length,
                in_transit: transfers.filter(t => t.status === 'in_transit').length,
                cancelled: transfers.filter(t => t.status === 'cancelled').length,
                total_value: totalValue
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/reports/debts
 * @desc    Get debt summary report
 * @access  Supervisor/CEO
 */
router.get('/debts', authorize('supervisor', 'ceo'), async (req, res, next) => {
    try {
        const debtSummary = await Debt.findAll({
            attributes: [
                'sales_person_id',
                [sequelize.fn('COUNT', sequelize.col('Debt.id')), 'debt_count'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_debt']
            ],
            where: { status: 'pending' },
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email', 'region']
                }
            ],
            group: ['sales_person_id', 'salesPerson.id'],
            order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
        });

        const totalOutstanding = await Debt.sum('amount', {
            where: { status: 'pending' }
        }) || 0;

        const overdueCount = await Debt.count({
            where: {
                status: 'pending',
                due_date: {
                    [sequelize.Sequelize.Op.lt]: new Date()
                }
            }
        });

        res.json({
            debtSummary,
            totals: {
                total_outstanding: totalOutstanding,
                overdue_count: overdueCount
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
