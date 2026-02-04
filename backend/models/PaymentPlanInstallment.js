const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaymentPlanInstallment = sequelize.define('PaymentPlanInstallment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    payment_plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'payment_plans',
            key: 'id'
        }
    },
    installment_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    paid_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'pending'
    },
    paid_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'payment_plan_installments',
    indexes: [
        { fields: ['payment_plan_id'] },
        { fields: ['status'] },
        { fields: ['due_date'] }
    ]
});

module.exports = PaymentPlanInstallment;
