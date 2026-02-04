import api from './apiService';

export const inventoryService = {
    // Get all inventory
    getInventory: async (params?: {
        store_id?: string;
        product_id?: string;
        low_stock?: boolean;
    }) => {
        const response = await api.get('/inventory', { params });
        return response.data.inventory;
    },

    // Get inventory by store
    getInventoryByStore: async (storeId: string) => {
        const response = await api.get(`/inventory/store/${storeId}`);
        return response.data.inventory;
    },

    // Get inventory by product
    getInventoryByProduct: async (productId: string) => {
        const response = await api.get(`/inventory/product/${productId}`);
        return response.data.inventory;
    },

    // Adjust inventory (stock in/out)
    adjustInventory: async (data: {
        store_id: string;
        product_id: string;
        quantity: number;
        type: 'in' | 'out';
        sales_person_id?: string;
        notes?: string;
    }) => {
        const response = await api.post('/inventory/adjust', data);
        return response.data;
    },

    // Get low stock items
    getLowStock: async () => {
        const response = await api.get('/inventory/low-stock');
        return response.data.inventory;
    }
};
