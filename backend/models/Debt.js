const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Debt = sequelize.define('Debt', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    sales_person_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid'),
        allowNull: false,
        defaultValue: 'pending'
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    invoice_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'invoices',
            key: 'id'
        }
    },
    payment_plan_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'debts',
    indexes: [
        { fields: ['sales_person_id'] },
        { fields: ['status'] },
        { fields: ['due_date'] },
        { fields: ['invoice_id'] }
    ]
});

module.exports = Debt;
