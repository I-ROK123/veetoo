# Backend Testing Guide

This guide will help you test all the VeeToo backend endpoints using the `requests.rest` file.

## Prerequisites

1. **Install REST Client Extension** (VS Code)
   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "REST Client" by Huachao Mao
   - Install it

2. **Start the Backend Server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Ensure MySQL is Running**
   - The database should be created and configured in `.env`

## Testing Workflow

### Step 1: Health Check
1. Open `requests.rest` in VS Code
2. Click "Send Request" above the Health Check endpoint
3. You should see: `{ "status": "ok", "timestamp": "..." }`

### Step 2: Create Users

**Create CEO Account:**
1. Find "Signup - CEO" (request #1)
2. Click "Send Request"
3. Copy the `token` from the response
4. Paste it in the `@token` variable at the top of the file

**Create Supervisor and Salesperson:**
1. Run "Signup - Supervisor" (request #2)
2. Run "Signup - Salesperson" (request #3)

### Step 3: Login and Get Token

**Login as CEO:**
1. Find "Login - CEO" (request #4)
2. Click "Send Request"
3. Copy the `token` from response
4. Update `@token` variable at top: `@token = YOUR_TOKEN_HERE`

### Step 4: Create Stores

Run these requests in order:
1. Request #8: Create Main Warehouse
2. Request #9: Create North Branch
3. Request #10: Create South Branch
4. Request #11: Get All Stores (verify stores were created)

**Copy Store IDs** from the response for later use.

### Step 5: Create Products

Run these requests:
1. Request #14: Create Laptop
2. Request #15: Create Mouse
3. Request #16: Create Office Chair
4. Request #17: Get All Products (verify)

**Copy Product IDs** from the response.

### Step 6: Add Inventory

Now add stock to stores:
1. Request #20: Stock In - Main Warehouse
   - Replace `STORE_ID_HERE` with Main Warehouse ID
   - Replace `PRODUCT_ID_HERE` with Laptop ID
   - Click Send Request

2. Request #21: Stock In - North Branch
   - Replace `STORE_ID_HERE` with North Branch ID
   - Replace `PRODUCT_ID_HERE` with Mouse ID
   - Click Send Request

3. Request #23: Get All Inventory (verify stock was added)

### Step 7: Test Inventory Transfer

**Complete Transfer Workflow:**
1. Request #28: Create Transfer Request
   - Set `from_store_id` to Main Warehouse ID
   - Set `to_store_id` to North Branch ID
   - Set `product_id` to Laptop ID
   - Set `quantity` to 10

2. Request #29: Get All Transfers
   - Copy the transfer ID from response

3. Request #32: Approve Transfer
   - Replace `TRANSFER_ID_HERE` with actual ID

4. Request #33: Complete Transfer
   - This will automatically update inventory in both stores

5. Request #23: Get All Inventory
   - Verify stock decreased in Main Warehouse
   - Verify stock increased in North Branch

### Step 8: Test Invoice Workflow

**Login as Salesperson first:**
1. Request #6: Login - Salesperson
2. Copy the token and update `@token`

**Create Invoice:**
1. Request #35: Create Invoice (as Salesperson)
2. Copy the invoice ID

**Login back as CEO/Supervisor:**
1. Request #4: Login - CEO
2. Update `@token` with CEO token

**Approve and Process Invoice:**
1. Request #41: Approve Invoice
   - Replace `INVOICE_ID_HERE` with actual ID

2. Request #43: Record Payment (partial)
   - Replace `INVOICE_ID_HERE`
   - This records $500 payment

3. Request #44: Record Full Payment
   - This completes the payment

4. Request #45: Reconcile Invoice
   - Marks invoice as reconciled

5. Request #40: Get Invoice by ID
   - Verify status is "cleared" and reconciled is true

### Step 9: Test Debt Management

1. Request #47: Create Debt
   - Replace `SALESPERSON_ID_HERE` with salesperson user ID
   - Replace `INVOICE_ID_HERE` with invoice ID (optional)

2. Request #48: Get All Debts
   - Copy debt ID

3. Request #51: Create Payment Plan
   - Replace `DEBT_ID_HERE` with actual debt ID
   - This creates weekly installments

4. Request #52: Get Payment Plan
   - View the generated installments

5. Request #53: Record Debt Payment
   - This pays one installment

6. Request #48: Get All Debts
   - Verify debt amount decreased

### Step 10: Test Reports

**CEO Dashboard:**
1. Request #54: Get CEO Dashboard
   - Shows all key metrics

**Reconciliation Report:**
1. Request #55: Get Reconciliation Report
   - Shows reconciliation status by salesperson

**Inventory Report:**
1. Request #57: Get Inventory Report
   - Shows inventory value by store

**Transfer History:**
1. Request #58: Get Transfer History
   - Shows all transfers with summary

**Debt Summary:**
1. Request #60: Get Debt Summary
   - Shows outstanding debts by salesperson

## Quick Testing Checklist

- [ ] Health check works
- [ ] Can create CEO, Supervisor, Salesperson accounts
- [ ] Can login and get JWT token
- [ ] Can create stores
- [ ] Can create products
- [ ] Can adjust inventory (stock in/out)
- [ ] Can create and complete inventory transfers
- [ ] Can create, approve, and reconcile invoices
- [ ] Can record payments against invoices
- [ ] Can create debts and payment plans
- [ ] Can record debt payments
- [ ] All reports return data

## Common Issues

### "Unauthorized" Error
- Make sure you've updated the `@token` variable
- Token might be expired (login again)

### "Store/Product/User not found"
- Replace placeholder IDs (STORE_ID_HERE, etc.) with actual IDs
- Copy IDs from previous responses

### "Insufficient permissions"
- Some endpoints require CEO or Supervisor role
- Login with appropriate user account

### Database Connection Error
- Ensure MySQL is running
- Check `.env` database credentials
- Verify database exists

## Tips

1. **Use Variables**: The REST Client supports variables
   - Define at top: `@storeId = abc-123`
   - Use in requests: `{{storeId}}`

2. **Save Responses**: Click "Save Response" to keep test data

3. **Test in Order**: Follow the workflow steps for best results

4. **Check Console**: Backend server logs show request details

5. **Use Named Requests**: Some requests have `# @name loginCEO`
   - You can reference their response: `{{loginCEO.response.body.token}}`

## Next Steps

After testing the backend:
1. ✅ Verify all endpoints work correctly
2. ✅ Test error cases (invalid data, missing fields)
3. ✅ Test role-based access control
4. 🔄 Integrate with frontend
5. 🔄 Add more test data
6. 🔄 Set up automated tests
