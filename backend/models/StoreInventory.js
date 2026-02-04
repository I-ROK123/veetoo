const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StoreInventory = sequelize.define('StoreInventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    store_id: {
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
    quantity_in_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    reorder_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    },
    last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'store_inventory',
    indexes: [
        { fields: ['store_id', 'product_id'], unique: true },
        { fields: ['product_id'] }
    ],
    hooks: {
        beforeUpdate: (inventory) => {
            inventory.last_updated = new Date();
        }
    }
});

module.exports = StoreInventory;
