const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    unit_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'products',
    indexes: [
        { fields: ['sku'], unique: true },
        { fields: ['category'] },
        { fields: ['is_active'] }
    ]
});

module.exports = Product;
