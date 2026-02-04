import api from './apiService';

export const invoiceService = {
  // Get all invoices
  getInvoices: async (params?: {
    status?: 'pending' | 'approved' | 'cleared' | 'rejected';
    sales_person_id?: string;
    reconciled?: boolean;
  }) => {
    const response = await api.get('/invoices', { params });
    return response.data.invoices;
  },

  // Get invoices needing reconciliation
  getReconciliationInvoices: async () => {
    const response = await api.get('/invoices/reconciliation');
    return response.data.invoices;
  },

  // Get invoice by ID
  getInvoice: async (id: string) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data.invoice;
  },

  // Create invoice
  createInvoice: async (data: {
    amount: number;
    sales_person_id?: string;
    qr_code?: string;
    image_url?: string;
  }) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  // Update invoice status (approve/reject)
  updateInvoiceStatus: async (id: string, data: {
    status: 'approved' | 'rejected';
    rejection_reason?: string;
  }) => {
    const response = await api.put(`/invoices/${id}/status`, data);
    return response.data;
  },

  // Record payment against invoice
  recordPayment: async (id: string, data: {
    payment_amount: number;
    payment_method: 'cash' | 'bank_transfer' | 'cheque' | 'mobile_money';
    reference_number?: string;
    payment_date?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/invoices/${id}/payments`, data);
    return response.data;
  },

  // Reconcile invoice
  reconcileInvoice: async (id: string, data?: {
    reconciliation_notes?: string;
  }) => {
    const response = await api.put(`/invoices/${id}/reconcile`, data);
    return response.data;
  },

  // Delete invoice
  deleteInvoice: async (id: string) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  }
};