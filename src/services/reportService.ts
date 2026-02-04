import api from './apiService';

export const reportService = {
  // Get CEO dashboard metrics
  getCEODashboard: async () => {
    const response = await api.get('/reports/dashboard/ceo');
    return response.data;
  },

  // Get reconciliation report
  getReconciliationReport: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/reports/reconciliation', { params });
    return response.data.reconciliationData;
  },

  // Get inventory report
  getInventoryReport: async () => {
    const response = await api.get('/reports/inventory');
    return response.data.inventoryByStore;
  },

  // Get transfer history report
  getTransferHistory: async (params?: {
    start_date?: string;
    end_date?: string;
    status?: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  }) => {
    const response = await api.get('/reports/inventory/transfers', { params });
    return response.data;
  },

  // Get debt summary report
  getDebtSummary: async () => {
    const response = await api.get('/reports/debts');
    return response.data;
  }
};