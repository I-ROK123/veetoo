const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Store = require('./Store');
const Product = require('./Product');
const StoreInventory = require('./StoreInventory');
const StockTransaction = require('./StockTransaction');
const InventoryTransfer = require('./InventoryTransfer');
const Invoice = require('./Invoice');
const InvoicePayment = require('./InvoicePayment');
const Debt = require('./Debt');
const PaymentPlan = require('./PaymentPlan');
const PaymentPlanInstallment = require('./PaymentPlanInstallment');
const Banking = require('./Banking');

// Define associations

// User associations
User.belongsTo(User, { as: 'supervisor', foreignKey: 'supervisor_id' });
User.hasMany(User, { as: 'salespeople', foreignKey: 'supervisor_id' });
User.belongsTo(Store, { as: 'assignedStore', foreignKey: 'assigned_store_id' });

// Store associations
Store.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });
Store.hasMany(User, { as: 'assignedUsers', foreignKey: 'assigned_store_id' });
Store.hasMany(StoreInventory, { foreignKey: 'store_id' });
Store.hasMany(StockTransaction, { foreignKey: 'store_id' });
Store.hasMany(InventoryTransfer, { as: 'transfersFrom', foreignKey: 'from_store_id' });
Store.hasMany(InventoryTransfer, { as: 'transfersTo', foreignKey: 'to_store_id' });

// Product associations
Product.hasMany(StoreInventory, { foreignKey: 'product_id' });
Product.hasMany(StockTransaction, { foreignKey: 'product_id' });
Product.hasMany(InventoryTransfer, { foreignKey: 'product_id' });

// StoreInventory associations
StoreInventory.belongsTo(Store, { foreignKey: 'store_id' });
StoreInventory.belongsTo(Product, { foreignKey: 'product_id' });

// StockTransaction associations
StockTransaction.belongsTo(Store, { foreignKey: 'store_id' });
StockTransaction.belongsTo(Product, { foreignKey: 'product_id' });
StockTransaction.belongsTo(User, { as: 'salesPerson', foreignKey: 'sales_person_id' });
StockTransaction.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

// InventoryTransfer associations
InventoryTransfer.belongsTo(Store, { as: 'fromStore', foreignKey: 'from_store_id' });
InventoryTransfer.belongsTo(Store, { as: 'toStore', foreignKey: 'to_store_id' });
InventoryTransfer.belongsTo(Product, { foreignKey: 'product_id' });
InventoryTransfer.belongsTo(User, { as: 'requester', foreignKey: 'requested_by' });
InventoryTransfer.belongsTo(User, { as: 'approver', foreignKey: 'approved_by' });
InventoryTransfer.belongsTo(User, { as: 'completer', foreignKey: 'completed_by' });

// Invoice associations
Invoice.belongsTo(User, { as: 'salesPerson', foreignKey: 'sales_person_id' });
Invoice.belongsTo(User, { as: 'approver', foreignKey: 'approved_by' });
Invoice.belongsTo(User, { as: 'reconciler', foreignKey: 'reconciled_by' });
Invoice.hasMany(InvoicePayment, { foreignKey: 'invoice_id' });
Invoice.hasMany(Debt, { foreignKey: 'invoice_id' });

// InvoicePayment associations
InvoicePayment.belongsTo(Invoice, { foreignKey: 'invoice_id' });
InvoicePayment.belongsTo(User, { as: 'recorder', foreignKey: 'recorded_by' });

// Debt associations
Debt.belongsTo(User, { as: 'salesPerson', foreignKey: 'sales_person_id' });
Debt.belongsTo(Invoice, { foreignKey: 'invoice_id' });
Debt.hasOne(PaymentPlan, { foreignKey: 'debt_id' });

// PaymentPlan associations
PaymentPlan.belongsTo(Debt, { foreignKey: 'debt_id' });
PaymentPlan.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
PaymentPlan.hasMany(PaymentPlanInstallment, { foreignKey: 'payment_plan_id' });

// PaymentPlanInstallment associations
PaymentPlanInstallment.belongsTo(PaymentPlan, { foreignKey: 'payment_plan_id' });

// Banking associations
Banking.belongsTo(User, { as: 'salesPerson', foreignKey: 'sales_person_id' });

// Export all models and sequelize instance
module.exports = {
    sequelize,
    User,
    Store,
    Product,
    StoreInventory,
    StockTransaction,
    InventoryTransfer,
    Invoice,
    InvoicePayment,
    Debt,
    PaymentPlan,
    PaymentPlanInstallment,
    Banking
};
