const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    invoice_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'cleared', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    sales_person_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    qr_code: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    approved_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    approved_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Reconciliation fields
    reconciled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    reconciled_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    reconciled_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    reconciliation_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    total_paid: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    }
}, {
    tableName: 'invoices',
    indexes: [
        { fields: ['invoice_number'], unique: true },
        { fields: ['sales_person_id'] },
        { fields: ['status'] },
        { fields: ['date'] },
        { fields: ['reconciled'] }
    ],
    hooks: {
        beforeCreate: (invoice) => {
            invoice.balance = invoice.amount - invoice.total_paid;
        },
        beforeUpdate: (invoice) => {
            invoice.balance = invoice.amount - invoice.total_paid;
        }
    }
});

module.exports = Invoice;
