const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('salesperson', 'supervisor', 'ceo'),
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    region: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    date_joined: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    supervisor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    assigned_store_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'stores',
            key: 'id'
        }
    },
    total_debt: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    daily_savings: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    is_flagged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sales_person_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'users',
    indexes: [
        { fields: ['email'] },
        { fields: ['role'] },
        { fields: ['supervisor_id'] },
        { fields: ['assigned_store_id'] }
    ]
});

module.exports = User;
