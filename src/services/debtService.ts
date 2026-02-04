import api from './apiService';

export const debtService = {
    // Get all debts
    getDebts: async (params?: {
        status?: 'pending' | 'paid';
        sales_person_id?: string;
    }) => {
        const response = await api.get('/debts', { params });
        return response.data.debts;
    },

    // Get debts by salesperson
    getDebtsBySalesperson: async (salespersonId: string) => {
        const response = await api.get(`/debts/salesperson/${salespersonId}`);
        return response.data.debts;
    },

    // Get overdue debts
    getOverdueDebts: async () => {
        const response = await api.get('/debts/overdue');
        return response.data.debts;
    },

    // Create debt
    createDebt: async (data: {
        sales_person_id: string;
        amount: number;
        due_date: string;
        invoice_id?: string;
        notes?: string;
    }) => {
        const response = await api.post('/debts', data);
        return response.data;
    },

    // Create payment plan
    createPaymentPlan: async (debtId: string, data: {
        installment_amount: number;
        frequency: 'daily' | 'weekly' | 'monthly';
        start_date: string;
        end_date: string;
    }) => {
        const response = await api.post(`/debts/${debtId}/payment-plan`, data);
        return response.data;
    },

    // Get payment plan
    getPaymentPlan: async (debtId: string) => {
        const response = await api.get(`/debts/${debtId}/payment-plan`);
        return response.data.paymentPlan;
    },

    // Record debt payment
    recordPayment: async (debtId: string, data: {
        amount: number;
    }) => {
        const response = await api.post(`/debts/${debtId}/payment`, data);
        return response.data;
    }
};
