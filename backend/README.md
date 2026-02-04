# VeeToo Backend Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Create a MySQL database for the application:

```sql
CREATE DATABASE veetoo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=veetoo_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Synchronization

The server will automatically create tables on first run. Alternatively, you can manually sync:

```bash
# Create tables (safe - won't drop existing data)
npm run db:sync

# Or update tables to match models (development)
npm run db:sync:alter
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Stores
- `GET /api/stores` - List all stores
- `POST /api/stores` - Create store (CEO/Supervisor)
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store (CEO/Supervisor)
- `DELETE /api/stores/:id` - Deactivate store (CEO)

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (CEO/Supervisor)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (CEO/Supervisor)
- `DELETE /api/products/:id` - Deactivate product (CEO)

### Inventory
- `GET /api/inventory` - Get inventory (all stores or filtered)
- `GET /api/inventory/store/:storeId` - Get inventory for specific store
- `GET /api/inventory/product/:productId` - Get product across stores
- `POST /api/inventory/adjust` - Adjust stock (CEO/Supervisor)
- `GET /api/inventory/low-stock` - Get low stock items

### Transfers
- `GET /api/transfers` - List transfers (with filters)
- `POST /api/transfers` - Create transfer request (CEO/Supervisor)
- `GET /api/transfers/:id` - Get transfer details
- `PUT /api/transfers/:id/approve` - Approve transfer (CEO/Supervisor)
- `PUT /api/transfers/:id/complete` - Complete transfer (CEO/Supervisor)
- `PUT /api/transfers/:id/cancel` - Cancel transfer (CEO/Supervisor)

### Invoices
- `GET /api/invoices` - List invoices (with filters)
- `GET /api/invoices/reconciliation` - Get unreconciled invoices (CEO/Supervisor)
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id/status` - Approve/reject invoice (CEO/Supervisor)
- `POST /api/invoices/:id/payments` - Record payment (CEO/Supervisor)
- `PUT /api/invoices/:id/reconcile` - Mark as reconciled (CEO/Supervisor)
- `DELETE /api/invoices/:id` - Delete invoice (CEO)

### Debts
- `GET /api/debts` - List debts (with filters)
- `GET /api/debts/salesperson/:id` - Get debts for salesperson
- `GET /api/debts/overdue` - Get overdue debts (CEO/Supervisor)
- `POST /api/debts` - Create debt (CEO/Supervisor)
- `POST /api/debts/:id/payment-plan` - Create payment plan (CEO/Supervisor)
- `GET /api/debts/:id/payment-plan` - Get payment plan
- `POST /api/debts/:id/payment` - Record debt payment (CEO/Supervisor)

### Reports
- `GET /api/reports/dashboard/ceo` - CEO dashboard metrics (CEO)
- `GET /api/reports/reconciliation` - Reconciliation summary (CEO/Supervisor)
- `GET /api/reports/inventory` - Inventory by store (CEO/Supervisor)
- `GET /api/reports/inventory/transfers` - Transfer history (CEO/Supervisor)
- `GET /api/reports/debts` - Debt summary (CEO/Supervisor)

## Testing the API

You can test the API using:
- **Postman** or **Thunder Client** (VS Code extension)
- **curl** commands
- The frontend application

### Example: Create a CEO user

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@veetoo.com",
    "password": "admin123",
    "role": "ceo"
  }'
```

## Database Models

The backend includes the following Sequelize models:

1. **User** - User accounts with roles (salesperson, supervisor, ceo)
2. **Store** - Store/warehouse locations
3. **Product** - Product catalog
4. **StoreInventory** - Inventory per store
5. **StockTransaction** - Stock movement history
6. **InventoryTransfer** - Transfers between stores
7. **Invoice** - Sales invoices with reconciliation
8. **InvoicePayment** - Payments against invoices
9. **Debt** - Salesperson debts
10. **PaymentPlan** - Debt payment plans
11. **PaymentPlanInstallment** - Individual installments
12. **Banking** - Banking transactions

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 3000

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords for database
- Enable HTTPS in production
- Implement rate limiting for production
- Regularly update dependencies
