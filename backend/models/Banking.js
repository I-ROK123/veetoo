const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banking = sequelize.define('Banking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    deposit_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    deposit_date: {
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
    }
}, {
    tableName: 'banking',
    indexes: [
        { fields: ['sales_person_id'] },
        { fields: ['deposit_date'] }
    ]
});

module.exports = Banking;
