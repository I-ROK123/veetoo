const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvoicePayment = sequelize.define('InvoicePayment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    invoice_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'invoices',
            key: 'id'
        }
    },
    payment_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'bank_transfer', 'cheque', 'mobile_money'),
        allowNull: false
    },
    reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    recorded_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'invoice_payments',
    indexes: [
        { fields: ['invoice_id'] },
        { fields: ['payment_date'] },
        { fields: ['payment_method'] }
    ]
});

module.exports = InvoicePayment;
