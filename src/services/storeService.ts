import api from './api';
import { Product, StockTransaction } from '../types/store';

export const storeService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/store/products');
      return response.data as Product[];
    } catch (error) {
      throw error;
    }
  },
  
  getProductById: async (productId: string) => {
    try {
      const response = await api.get(`/store/products/${productId}`);
      return response.data as Product;
    } catch (error) {
      throw error;
    }
  },
  
  createProduct: async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await api.post('/store/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProduct: async (productId: string, productData: Partial<Product>) => {
    try {
      const response = await api.put(`/store/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteProduct: async (productId: string) => {
    try {
      const response = await api.delete(`/store/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  recordStockTransaction: async (transactionData: Omit<StockTransaction, 'id' | 'date'>) => {
    try {
      const response = await api.post('/store/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getStockTransactions: async (filters?: { 
    productId?: string;
    salesPersonId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await api.get('/store/transactions', { params: filters });
      return response.data as StockTransaction[];
    } catch (error) {
      throw error;
    }
  }
};