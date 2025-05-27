import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { mockUsers } from './mockData/users';
import { mockInvoices } from './mockData/invoices';
import { mockProducts } from './mockData/products';
import { mockDeposits } from './mockData/banking';
import { mockDashboardStats } from './mockData/reports';

type SalespersonId = 'sp1' | 'sp2' | 'sp3';

// Mock data for debt payments and debt summaries
const mockDebtPayments: Record<SalespersonId, { id: string; amount: number; date: string; status: string }[]> = {
  sp1: [
    { id: 'dp1', amount: 1000, date: '2023-06-01', status: 'paid' },
    { id: 'dp2', amount: 500, date: '2023-06-15', status: 'pending' }
  ],
  sp2: [
    { id: 'dp3', amount: 2000, date: '2023-05-20', status: 'paid' }
  ],
  sp3: []
};

const mockDebtSummaries: Record<SalespersonId, { totalDebt: number; overdueDebt: number; debtRatio: number }> = {
  sp1: { totalDebt: 5000, overdueDebt: 1000, debtRatio: 0.2 },
  sp2: { totalDebt: 3000, overdueDebt: 500, debtRatio: 0.1667 },
  sp3: { totalDebt: 0, overdueDebt: 0, debtRatio: 0 }
};

// Create handlers array
const handlers = [
  // Auth endpoints
  http.post('/api/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const { email, password } = body;
    
    // Find user with matching email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || password !== 'password') {
      return new HttpResponse(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }
    
    return new HttpResponse(
      JSON.stringify({
        user,
        token: 'mock-jwt-token'
      }),
      { status: 200 }
    );
  }),
  
  // User endpoints
  http.get('/api/user/me', () => {
    const user = mockUsers[0]; // Default to first user for demo
    
    return new HttpResponse(
      JSON.stringify(user),
      { status: 200 }
    );
  }),
  
  // Invoice endpoints
  http.get('/api/salesperson/:id/invoices', ({ params, request }) => {
    const { id } = params;
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let filteredInvoices = mockInvoices.filter(inv => inv.salesPersonId === id);
    
    if (status && status !== 'all') {
      filteredInvoices = filteredInvoices.filter(inv => inv.status === status);
    }
    
    return new HttpResponse(
      JSON.stringify(filteredInvoices),
      { status: 200 }
    );
  }),
  
  http.post('/api/invoice/upload', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('invoice') as File;
    
    if (!file) {
      return new HttpResponse(
        JSON.stringify({ message: 'No file uploaded' }),
        { status: 400 }
      );
    }
    
    // Simulate invoice processing
    const newInvoice = {
      id: `inv_${Date.now()}`,
      salesPersonId: 'sp1',
      salesPersonName: 'John Mwangi',
      invoiceNumber: `INV-${Date.now()}`,
      amount: Math.floor(Math.random() * 10000) + 1000,
      date: new Date().toISOString(),
      status: 'pending' as const,
      qrCode: `QR_${Date.now()}`,
      imageUrl: URL.createObjectURL(file),
      payments: []
    };
    
    return new HttpResponse(
      JSON.stringify(newInvoice),
      { status: 201 }
    );
  }),
  
  // Payment endpoints
  http.post('/api/payment/submit', async ({ request }) => {
    const body = await request.json() as { invoiceId: string; amount: number; imageUrl?: string };
    
    const newPayment = {
      id: `pay_${Date.now()}`,
      invoiceId: body.invoiceId,
      amount: body.amount,
      date: new Date().toISOString(),
      status: 'pending' as const,
      imageUrl: body.imageUrl
    };
    
    return new HttpResponse(
      JSON.stringify(newPayment),
      { status: 201 }
    );
  }),
  
  // Store endpoints
  http.get('/api/store/products', () => {
    return new HttpResponse(
      JSON.stringify(mockProducts),
      { status: 200 }
    );
  }),
  
  http.post('/api/store/update', async ({ request }) => {
    const body = await request.json();
    
    return new HttpResponse(
      JSON.stringify({ message: 'Store updated successfully', data: body }),
      { status: 200 }
    );
  }),
  
  // Banking endpoints
  http.get('/api/banking/deposits', () => {
    return new HttpResponse(
      JSON.stringify(mockDeposits),
      { status: 200 }
    );
  }),
  
  http.post('/api/banking/record', async ({ request }) => {
    const body = await request.json();
    
    return new HttpResponse(
      JSON.stringify({ message: 'Banking record created', data: body }),
      { status: 201 }
    );
  }),

  // New handlers for debt payments and debt summaries
  http.get('/api/banking/debt-payments/:salespersonId', ({ params }: { params: { salespersonId: string } }) => {
    const { salespersonId } = params;
    // Type assertion to SalespersonId or fallback to 'sp1'
    const validIds = ['sp1', 'sp2', 'sp3'] as const;
    const spId = validIds.includes(salespersonId as SalespersonId) ? salespersonId as SalespersonId : 'sp1';
    const payments = mockDebtPayments[spId] || [];
    return new HttpResponse(
      JSON.stringify(payments),
      { status: 200 }
    );
  }),

  http.get('/api/banking/debt-summary/:salespersonId', ({ params }: { params: { salespersonId: string } }) => {
    const { salespersonId } = params;
    // Type assertion to SalespersonId or fallback to 'sp1'
    const validIds = ['sp1', 'sp2', 'sp3'] as const;
    const spId = validIds.includes(salespersonId as SalespersonId) ? salespersonId as SalespersonId : 'sp1';
    const summary = mockDebtSummaries[spId] || null;
    return new HttpResponse(
      JSON.stringify(summary),
      { status: 200 }
    );
  }),

  // Report endpoints
  http.get('/api/reports/:role/dashboard', ({ params }) => {
    const { role } = params;
    
    if (role === 'salesperson') {
      return new HttpResponse(
        JSON.stringify(mockDashboardStats.salesperson),
        { status: 200 }
      );
    }
    
    if (role === 'supervisor') {
      return new HttpResponse(
        JSON.stringify(mockDashboardStats.supervisor),
        { status: 200 }
      );
    }
    
    if (role === 'ceo') {
      return new HttpResponse(
        JSON.stringify(mockDashboardStats.ceo),
        { status: 200 }
      );
    }
    
    return new HttpResponse(
      JSON.stringify({ message: 'Role not found' }),
      { status: 404 }
    );
  })
];

// Create and export worker
export const mockServiceWorker = setupWorker(...handlers);

// Conditional start for development (browser environment check)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  mockServiceWorker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  }).catch(console.error);
}
