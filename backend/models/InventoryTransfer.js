const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InventoryTransfer = sequelize.define('InventoryTransfer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    transfer_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    from_store_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'id'
        }
    },
    to_store_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_transit', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    requested_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    approved_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    completed_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    requested_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    approved_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    completed_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'inventory_transfers',
    indexes: [
        { fields: ['transfer_number'], unique: true },
        { fields: ['from_store_id'] },
        { fields: ['to_store_id'] },
        { fields: ['product_id'] },
        { fields: ['status'] },
        { fields: ['requested_date'] }
    ]
});

module.exports = InventoryTransfer;
