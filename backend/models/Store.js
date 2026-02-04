const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    manager_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'stores',
    indexes: [
        { fields: ['manager_id'] },
        { fields: ['is_active'] }
    ]
});

module.exports = Store;
