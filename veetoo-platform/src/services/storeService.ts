import api from './api';
import { Product, StockTransaction } from '../types/store';

export const storeService = {
  getAllProducts: async () => {
    const response = await api.get('/store/products');
    return response.data as Product[];
  },
  
  getProductsByStore: async (storeId: string) => {
    const response = await api.get(`/store/${storeId}/products`);
    return response.data as Product[];
  },

  getProductById: async (productId: string) => {
    const response = await api.get(`/store/products/${productId}`);
    return response.data as Product;
  },
  
  createProduct: async (productData: Omit<Product, 'id'>) => {
    const response = await api.post('/store/products', productData);
    return response.data;
  },
  
  updateProduct: async (productId: string, productData: Partial<Product>) => {
    const response = await api.put(`/store/products/${productId}`, productData);
    return response.data;
  },
  
  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/store/products/${productId}`);
    return response.data;
  },
  
  recordStockTransaction: async (transactionData: Omit<StockTransaction, 'id' | 'date'>) => {
    const response = await api.post('/store/transactions', transactionData);
    return response.data;
  },
  
  getStockTransactions: async (filters?: { 
    productId?: string;
    salesPersonId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/store/transactions', { params: filters });
    return response.data as StockTransaction[];
  }
};
