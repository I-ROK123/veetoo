const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaymentPlan = sequelize.define('PaymentPlan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    debt_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'debts',
            key: 'id'
        }
    },
    total_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    installment_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    frequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'defaulted'),
        allowNull: false,
        defaultValue: 'active'
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'payment_plans',
    indexes: [
        { fields: ['debt_id'] },
        { fields: ['status'] },
        { fields: ['start_date'] },
        { fields: ['end_date'] }
    ]
});

module.exports = PaymentPlan;
