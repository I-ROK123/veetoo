const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StockTransaction = sequelize.define('StockTransaction', {
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
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('in', 'out'),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    sales_person_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'stock_transactions',
    indexes: [
        { fields: ['store_id'] },
        { fields: ['product_id'] },
        { fields: ['sales_person_id'] },
        { fields: ['date'] },
        { fields: ['type'] }
    ]
});

module.exports = StockTransaction;
