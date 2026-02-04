const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Invoice, InvoicePayment, User, Debt } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Generate unique invoice number
 */
const generateInvoiceNumber = async () => {
    const date = new Date();
    const prefix = `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const count = await Invoice.count({
        where: {
            invoice_number: {
                [sequelize.Sequelize.Op.like]: `${prefix}%`
            }
        }
    });
    return `${prefix}-${String(count + 1).padStart(5, '0')}`;
};

/**
 * @route   GET /api/invoices
 * @desc    Get all invoices with filters
 * @access  Private
 */
router.get('/', [
    query('status').optional().isIn(['pending', 'approved', 'cleared', 'rejected']),
    query('sales_person_id').optional().isUUID(),
    query('reconciled').optional().isBoolean()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status, sales_person_id, reconciled } = req.query;

        const where = {};
        if (status) where.status = status;
        if (sales_person_id) where.sales_person_id = sales_person_id;
        if (reconciled !== undefined) where.reconciled = reconciled === 'true';

        // Salespeople can only see their own invoices
        if (req.user.role === 'salesperson') {
            where.sales_person_id = req.user.id;
        }

        const invoices = await Invoice.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'approver',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'reconciler',
                    attributes: ['id', 'name']
                },
                {
                    model: InvoicePayment,
                    separate: true,
                    order: [['payment_date', 'DESC']]
                }
            ],
            order: [['date', 'DESC']]
        });

        res.json({ invoices });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/invoices/reconciliation
 * @desc    Get invoices needing reconciliation
 * @access  Supervisor/CEO
 */
router.get('/reconciliation', authorize('supervisor', 'ceo'), async (req, res, next) => {
    try {
        const invoices = await Invoice.findAll({
            where: {
                status: 'approved',
                reconciled: false
            },
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email', 'region']
                },
                {
                    model: InvoicePayment,
                    separate: true,
                    order: [['payment_date', 'DESC']]
                }
            ],
            order: [['date', 'ASC']]
        });

        res.json({ invoices });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/invoices/:id
 * @desc    Get invoice by ID
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email', 'phone_number']
                },
                {
                    model: User,
                    as: 'approver',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'reconciler',
                    attributes: ['id', 'name']
                },
                {
                    model: InvoicePayment,
                    include: [
                        {
                            model: User,
                            as: 'recorder',
                            attributes: ['id', 'name']
                        }
                    ],
                    order: [['payment_date', 'DESC']]
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Salespeople can only see their own invoices
        if (req.user.role === 'salesperson' && invoice.sales_person_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ invoice });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/invoices
 * @desc    Create new invoice
 * @access  Salesperson/Supervisor/CEO
 */
router.post('/', [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('sales_person_id').optional().isUUID(),
    body('qr_code').optional().trim(),
    body('image_url').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount, sales_person_id, qr_code, image_url } = req.body;

        // Determine sales person ID
        let finalSalesPersonId = sales_person_id;
        if (req.user.role === 'salesperson') {
            finalSalesPersonId = req.user.id; // Salespeople can only create for themselves
        } else if (!sales_person_id) {
            return res.status(400).json({ error: 'sales_person_id is required for supervisors/CEO' });
        }

        // Generate invoice number
        const invoice_number = await generateInvoiceNumber();

        const invoice = await Invoice.create({
            invoice_number,
            amount,
            sales_person_id: finalSalesPersonId,
            date: new Date(),
            status: 'pending',
            qr_code,
            image_url,
            balance: amount
        });

        res.status(201).json({
            message: 'Invoice created successfully',
            invoice
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/invoices/:id/status
 * @desc    Update invoice status (approve/reject)
 * @access  Supervisor/CEO
 */
router.put('/:id/status', authorize('supervisor', 'ceo'), [
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
    body('rejection_reason').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status, rejection_reason } = req.body;

        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (invoice.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending invoices can be approved/rejected' });
        }

        await invoice.update({
            status,
            approved_by: req.user.id,
            approved_date: new Date(),
            ...(status === 'rejected' && { rejection_reason })
        });

        res.json({
            message: `Invoice ${status} successfully`,
            invoice
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/invoices/:id/payments
 * @desc    Record payment against invoice
 * @access  Supervisor/CEO
 */
router.post('/:id/payments', authorize('supervisor', 'ceo'), [
    body('payment_amount').isFloat({ min: 0.01 }).withMessage('Payment amount must be greater than 0'),
    body('payment_method').isIn(['cash', 'bank_transfer', 'cheque', 'mobile_money']).withMessage('Invalid payment method'),
    body('reference_number').optional().trim(),
    body('payment_date').optional().isISO8601(),
    body('notes').optional().trim()
], async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(400).json({ errors: errors.array() });
        }

        const { payment_amount, payment_method, reference_number, payment_date, notes } = req.body;

        const invoice = await Invoice.findByPk(req.params.id, { transaction });
        if (!invoice) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (payment_amount > invoice.balance) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Payment amount exceeds outstanding balance' });
        }

        // Create payment record
        const payment = await InvoicePayment.create({
            invoice_id: invoice.id,
            payment_amount,
            payment_method,
            reference_number,
            payment_date: payment_date || new Date(),
            recorded_by: req.user.id,
            notes
        }, { transaction });

        // Update invoice totals
        const newTotalPaid = parseFloat(invoice.total_paid) + parseFloat(payment_amount);
        const newBalance = parseFloat(invoice.amount) - newTotalPaid;

        await invoice.update({
            total_paid: newTotalPaid,
            balance: newBalance,
            status: newBalance === 0 ? 'cleared' : invoice.status
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            message: 'Payment recorded successfully',
            payment,
            invoice: {
                id: invoice.id,
                total_paid: newTotalPaid,
                balance: newBalance,
                status: invoice.status
            }
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
});

/**
 * @route   PUT /api/invoices/:id/reconcile
 * @desc    Mark invoice as reconciled
 * @access  Supervisor/CEO
 */
router.put('/:id/reconcile', authorize('supervisor', 'ceo'), [
    body('reconciliation_notes').optional().trim()
], async (req, res, next) => {
    try {
        const { reconciliation_notes } = req.body;

        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (invoice.status !== 'approved' && invoice.status !== 'cleared') {
            return res.status(400).json({ error: 'Only approved or cleared invoices can be reconciled' });
        }

        await invoice.update({
            reconciled: true,
            reconciled_by: req.user.id,
            reconciled_date: new Date(),
            reconciliation_notes
        });

        res.json({
            message: 'Invoice reconciled successfully',
            invoice
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/invoices/:id
 * @desc    Delete invoice
 * @access  CEO only
 */
router.delete('/:id', authorize('ceo'), async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (invoice.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending invoices can be deleted' });
        }

        await invoice.destroy();

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
