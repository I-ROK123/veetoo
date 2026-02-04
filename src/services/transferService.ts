import api from './apiService';

export const transferService = {
    // Get all transfers
    getTransfers: async (params?: {
        status?: 'pending' | 'in_transit' | 'completed' | 'cancelled';
        from_store_id?: string;
        to_store_id?: string;
        product_id?: string;
    }) => {
        const response = await api.get('/transfers', { params });
        return response.data.transfers;
    },

    // Get transfer by ID
    getTransfer: async (id: string) => {
        const response = await api.get(`/transfers/${id}`);
        return response.data.transfer;
    },

    // Create transfer request
    createTransfer: async (data: {
        from_store_id: string;
        to_store_id: string;
        product_id: string;
        quantity: number;
        notes?: string;
    }) => {
        const response = await api.post('/transfers', data);
        return response.data;
    },

    // Approve transfer
    approveTransfer: async (id: string) => {
        const response = await api.put(`/transfers/${id}/approve`);
        return response.data;
    },

    // Complete transfer
    completeTransfer: async (id: string) => {
        const response = await api.put(`/transfers/${id}/complete`);
        return response.data;
    },

    // Cancel transfer
    cancelTransfer: async (id: string) => {
        const response = await api.put(`/transfers/${id}/cancel`);
        return response.data;
    }
};
