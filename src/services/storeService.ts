import api from './apiService';

export const storeService = {
  // Get all stores
  getStores: async () => {
    const response = await api.get('/stores');
    return response.data.stores;
  },

  // Get store by ID
  getStore: async (id: string) => {
    const response = await api.get(`/stores/${id}`);
    return response.data.store;
  },

  // Create store
  createStore: async (storeData: {
    name: string;
    location: string;
    manager_id?: string;
    phone_number?: string;
  }) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },

  // Update store
  updateStore: async (id: string, storeData: any) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
  },

  // Deactivate store
  deleteStore: async (id: string) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  }
};