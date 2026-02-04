# Frontend-Backend Integration Guide

## ✅ Integration Complete

The VeeToo frontend has been successfully integrated with the new backend API.

## 🔄 Changes Made

### 1. API Configuration
- **Updated** `src/services/apiService.ts` - Changed base URL from ngrok to `http://localhost:3000/api`
- **Created** `.env` and `.env.example` - Environment configuration for API URL

### 2. New Service Files Created

All services now match the backend API endpoints:

#### **storeService.ts** - Multi-Store Management
- `getStores()` - List all stores
- `getStore(id)` - Get store details
- `createStore(data)` - Create new store
- `updateStore(id, data)` - Update store
- `deleteStore(id)` - Deactivate store

#### **inventoryService.ts** - Multi-Store Inventory
- `getInventory(params)` - Get inventory with filters
- `getInventoryByStore(storeId)` - Store-specific inventory
- `getInventoryByProduct(productId)` - Product across stores
- `adjustInventory(data)` - Stock in/out operations
- `getLowStock()` - Low stock alerts

#### **transferService.ts** - Inventory Transfers
- `getTransfers(params)` - List transfers with filters
- `getTransfer(id)` - Get transfer details
- `createTransfer(data)` - Request transfer
- `approveTransfer(id)` - Approve transfer
- `completeTransfer(id)` - Complete transfer (updates inventory)
- `cancelTransfer(id)` - Cancel transfer

#### **invoiceService.ts** - Invoice Reconciliation
- `getInvoices(params)` - List invoices
- `getReconciliationInvoices()` - Unreconciled invoices
- `getInvoice(id)` - Invoice details
- `createInvoice(data)` - Create invoice
- `updateInvoiceStatus(id, data)` - Approve/reject
- `recordPayment(id, data)` - Record payment
- `reconcileInvoice(id, data)` - Mark as reconciled
- `deleteInvoice(id)` - Delete invoice

#### **debtService.ts** - Debt Management
- `getDebts(params)` - List debts
- `getDebtsBySalesperson(id)` - Salesperson debts
- `getOverdueDebts()` - Overdue debts
- `createDebt(data)` - Create debt
- `createPaymentPlan(debtId, data)` - Set up payment plan
- `getPaymentPlan(debtId)` - Get payment plan details
- `recordPayment(debtId, data)` - Record payment

#### **reportService.ts** - CEO Reporting
- `getCEODashboard()` - Dashboard metrics
- `getReconciliationReport(params)` - Reconciliation summary
- `getInventoryReport()` - Inventory by store
- `getTransferHistory(params)` - Transfer history
- `getDebtSummary()` - Debt summary

### 3. Updated Existing Services
- **authService.ts** - Updated to use new backend auth endpoints

## 🚀 How to Use

### Start Both Servers

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Frontend:**
```bash
cd ..
npm run dev
# Frontend runs on http://localhost:5173
```

### Using the Services in Components

```typescript
// Example: Using store service
import { storeService } from '../services/storeService';

const stores = await storeService.getStores();

// Example: Using inventory service
import { inventoryService } from '../services/inventoryService';

const inventory = await inventoryService.getInventoryByStore(storeId);

// Example: Using transfer service
import { transferService } from '../services/transferService';

await transferService.createTransfer({
  from_store_id: 'store-1',
  to_store_id: 'store-2',
  product_id: 'product-1',
  quantity: 10
});

// Example: Using invoice reconciliation
import { invoiceService } from '../services/invoiceService';

await invoiceService.recordPayment(invoiceId, {
  payment_amount: 500,
  payment_method: 'cash',
  reference_number: 'PAY-001'
});

await invoiceService.reconcileInvoice(invoiceId, {
  reconciliation_notes: 'All payments verified'
});

// Example: Using debt service
import { debtService } from '../services/debtService';

await debtService.createPaymentPlan(debtId, {
  installment_amount: 500,
  frequency: 'weekly',
  start_date: '2024-02-10',
  end_date: '2024-04-10'
});

// Example: Using reports
import { reportService } from '../services/reportService';

const dashboard = await reportService.getCEODashboard();
const reconciliation = await reportService.getReconciliationReport();
```

## 🔐 Authentication Flow

The authentication is handled automatically:
1. User logs in via `authService.login()`
2. Backend returns JWT token
3. Token is stored in Zustand store
4. All API requests include token in Authorization header
5. Backend validates token on protected routes

## 📝 Next Steps

### UI Components to Update/Create:

1. **Multi-Store Management**
   - Store list page
   - Store creation/edit forms
   - Store selector component

2. **Inventory Management**
   - Multi-store inventory view
   - Stock adjustment interface
   - Low stock alerts

3. **Transfer Management**
   - Transfer request form
   - Transfer approval workflow
   - Transfer history view

4. **Invoice Reconciliation**
   - Reconciliation dashboard
   - Payment recording interface
   - Reconciliation status tracking

5. **Debt Management**
   - Debt list view
   - Payment plan creation
   - Installment tracking

6. **CEO Dashboard**
   - Update with new metrics
   - Reconciliation reports
   - Inventory reports
   - Transfer reports

## ✅ Testing Checklist

- [ ] Login with different roles (CEO, Supervisor, Salesperson)
- [ ] Create and manage stores
- [ ] Add products to different stores
- [ ] Adjust inventory (stock in/out)
- [ ] Create and complete inventory transfers
- [ ] Create invoices and record payments
- [ ] Reconcile invoices
- [ ] Create debts and payment plans
- [ ] View all reports

## 🐛 Troubleshooting

### CORS Errors
- Make sure backend is running on port 3000
- Check that frontend .env has correct API URL

### Authentication Errors
- Clear browser localStorage
- Login again to get fresh token
- Check token is being sent in headers

### API Errors
- Check backend console for errors
- Verify database is running
- Check backend .env configuration

---

**Status**: ✅ Frontend successfully integrated with backend API!
