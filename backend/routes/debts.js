const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Debt, PaymentPlan, PaymentPlanInstallment, User, Invoice } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/debts
 * @desc    Get all debts with filters
 * @access  Private
 */
router.get('/', [
    query('status').optional().isIn(['pending', 'paid']),
    query('sales_person_id').optional().isUUID()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status, sales_person_id } = req.query;

        const where = {};
        if (status) where.status = status;
        if (sales_person_id) where.sales_person_id = sales_person_id;

        // Salespeople can only see their own debts
        if (req.user.role === 'salesperson') {
            where.sales_person_id = req.user.id;
        }

        const debts = await Debt.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email', 'region']
                },
                {
                    model: Invoice,
                    attributes: ['id', 'invoice_number', 'amount']
                },
                {
                    model: PaymentPlan,
                    include: [
                        {
                            model: PaymentPlanInstallment,
                            order: [['due_date', 'ASC']]
                        }
                    ]
                }
            ],
            order: [['due_date', 'ASC']]
        });

        res.json({ debts });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/debts/salesperson/:id
 * @desc    Get debts for specific salesperson
 * @access  Private
 */
router.get('/salesperson/:id', async (req, res, next) => {
    try {
        // Salespeople can only view their own debts
        if (req.user.role === 'salesperson' && req.params.id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const debts = await Debt.findAll({
            where: { sales_person_id: req.params.id },
            include: [
                {
                    model: Invoice,
                    attributes: ['id', 'invoice_number', 'amount', 'date']
                },
                {
                    model: PaymentPlan,
                    include: [
                        {
                            model: PaymentPlanInstallment,
                            order: [['due_date', 'ASC']]
                        }
                    ]
                }
            ],
            order: [['due_date', 'ASC']]
        });

        res.json({ debts });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/debts/overdue
 * @desc    Get overdue debts
 * @access  Supervisor/CEO
 */
router.get('/overdue', authorize('supervisor', 'ceo'), async (req, res, next) => {
    try {
        const debts = await Debt.findAll({
            where: {
                status: 'pending',
                due_date: {
                    [sequelize.Sequelize.Op.lt]: new Date()
                }
            },
            include: [
                {
                    model: User,
                    as: 'salesPerson',
                    attributes: ['id', 'name', 'email', 'phone_number', 'region']
                },
                {
                    model: Invoice,
                    attributes: ['id', 'invoice_number', 'amount']
                }
            ],
            order: [['due_date', 'ASC']]
        });

        res.json({ debts, count: debts.length });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/debts
 * @desc    Create new debt
 * @access  Supervisor/CEO
 */
router.post('/', authorize('supervisor', 'ceo'), [
    body('sales_person_id').isUUID().withMessage('Valid salesperson ID is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('due_date').isISO8601().withMessage('Valid due date is required'),
    body('invoice_id').optional().isUUID(),
    body('notes').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { sales_person_id, amount, due_date, invoice_id, notes } = req.body;

        const debt = await Debt.create({
            sales_person_id,
            amount,
            due_date,
            invoice_id,
            notes,
            status: 'pending'
        });

        res.status(201).json({
            message: 'Debt created successfully',
            debt
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/debts/:id/payment-plan
 * @desc    Create payment plan for debt
 * @access  Supervisor/CEO
 */
router.post('/:id/payment-plan', authorize('supervisor', 'ceo'), [
    body('installment_amount').isFloat({ min: 0.01 }).withMessage('Installment amount must be greater than 0'),
    body('frequency').isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid frequency'),
    body('start_date').isISO8601().withMessage('Valid start date is required'),
    body('end_date').isISO8601().withMessage('Valid end date is required')
], async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(400).json({ errors: errors.array() });
        }

        const debt = await Debt.findByPk(req.params.id, { transaction });
        if (!debt) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Debt not found' });
        }

        // Check if payment plan already exists
        const existingPlan = await PaymentPlan.findOne({
            where: { debt_id: debt.id, status: 'active' },
            transaction
        });

        if (existingPlan) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Active payment plan already exists for this debt' });
        }

        const { installment_amount, frequency, start_date, end_date } = req.body;

        // Create payment plan
        const paymentPlan = await PaymentPlan.create({
            debt_id: debt.id,
            total_amount: debt.amount,
            installment_amount,
            frequency,
            start_date,
            end_date,
            status: 'active',
            created_by: req.user.id
        }, { transaction });

        // Generate installments
        const installments = [];
        let currentDate = new Date(start_date);
        const endDate = new Date(end_date);
        let installmentNumber = 1;
        let remainingAmount = parseFloat(debt.amount);

        while (currentDate <= endDate && remainingAmount > 0) {
            const amount = Math.min(parseFloat(installment_amount), remainingAmount);

            installments.push({
                payment_plan_id: paymentPlan.id,
                installment_number: installmentNumber++,
                due_date: new Date(currentDate),
                amount,
                status: 'pending'
            });

            remainingAmount -= amount;

            // Increment date based on frequency
            if (frequency === 'daily') {
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (frequency === 'weekly') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (frequency === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }

        await PaymentPlanInstallment.bulkCreate(installments, { transaction });

        await transaction.commit();

        res.status(201).json({
            message: 'Payment plan created successfully',
            paymentPlan,
            installments
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
});

/**
 * @route   GET /api/debts/:id/payment-plan
 * @desc    Get payment plan for debt
 * @access  Private
 */
router.get('/:id/payment-plan', async (req, res, next) => {
    try {
        const debt = await Debt.findByPk(req.params.id);
        if (!debt) {
            return res.status(404).json({ error: 'Debt not found' });
        }

        // Salespeople can only view their own debt payment plans
        if (req.user.role === 'salesperson' && debt.sales_person_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const paymentPlan = await PaymentPlan.findOne({
            where: { debt_id: debt.id },
            include: [
                {
                    model: PaymentPlanInstallment,
                    order: [['due_date', 'ASC']]
                }
            ]
        });

        if (!paymentPlan) {
            return res.status(404).json({ error: 'Payment plan not found' });
        }

        res.json({ paymentPlan });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/debts/:id/payment
 * @desc    Record debt payment
 * @access  Supervisor/CEO
 */
router.post('/:id/payment', authorize('supervisor', 'ceo'), [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
], async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount } = req.body;

        const debt = await Debt.findByPk(req.params.id, { transaction });
        if (!debt) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Debt not found' });
        }

        if (parseFloat(amount) > parseFloat(debt.amount)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Payment amount exceeds debt amount' });
        }

        // Update debt
        const newAmount = parseFloat(debt.amount) - parseFloat(amount);
        await debt.update({
            amount: newAmount,
            status: newAmount === 0 ? 'paid' : 'pending'
        }, { transaction });

        // Update payment plan installments if exists
        const paymentPlan = await PaymentPlan.findOne({
            where: { debt_id: debt.id },
            transaction
        });

        if (paymentPlan) {
            let remainingPayment = parseFloat(amount);

            const installments = await PaymentPlanInstallment.findAll({
                where: {
                    payment_plan_id: paymentPlan.id,
                    status: ['pending', 'overdue']
                },
                order: [['due_date', 'ASC']],
                transaction
            });

            for (const installment of installments) {
                if (remainingPayment <= 0) break;

                const installmentBalance = parseFloat(installment.amount) - parseFloat(installment.paid_amount);
                const paymentToApply = Math.min(remainingPayment, installmentBalance);

                const newPaidAmount = parseFloat(installment.paid_amount) + paymentToApply;
                await installment.update({
                    paid_amount: newPaidAmount,
                    status: newPaidAmount >= parseFloat(installment.amount) ? 'paid' : installment.status,
                    paid_date: newPaidAmount >= parseFloat(installment.amount) ? new Date() : installment.paid_date
                }, { transaction });

                remainingPayment -= paymentToApply;
            }
        }

        await transaction.commit();

        res.json({
            message: 'Payment recorded successfully',
            debt
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
});

module.exports = router;
