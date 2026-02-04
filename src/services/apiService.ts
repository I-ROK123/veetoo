/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useAuthStore } from '../hooks/useAuthStore';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Auth endpoints
// export const login = (credentials: { email: string; password: string }) => 
//   api.post('/auth/login', credentials);

export const signup = (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone_number?: string;
  region?: string;
}) => api.post('/auth/signup', userData);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Check for HTML responses
    const contentType = response.headers?.['content-type'];
    if (contentType?.includes('text/html')) {
      throw new Error('Received HTML response - possible authentication issue');
    }
    return response;
  },
  (error) => {
    const response = error.response;
    const status = response?.status;

    // Check for HTML error pages
    const contentType = response?.headers?.['content-type'];
    if (contentType?.includes('text/html')) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication required'));
    }

    // Handle 401 Unauthorized errors (token expired, etc.)
    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials);

// Product endpoints
export const getProducts = () => api.get('/products');
export const createProduct = (productData: any) => api.post('/products', productData);
export const getProduct = (id: string) => api.get(`/products/${id}`);
export const updateProduct = (id: string, productData: any) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Stock Transaction endpoints
export const getStockTransactions = () => api.get('/stock-transactions');
export const createStockTransaction = (transactionData: any) =>
  api.post('/stock-transactions', transactionData);

// Invoice endpoints
export const getInvoices = () => api.get('/invoices');
export const createInvoice = (invoiceData: any) => api.post('/invoices', invoiceData);
export const updateInvoiceStatus = (id: string, statusData: any) =>
  api.put(`/invoices/${id}/status`, statusData);
export const deleteInvoice = (id: string) => api.delete(`/invoices/${id}`);

// Debt endpoints
export const getDebts = () => api.get('/debts');
export const createDebt = (debtData: any) => api.post('/debts', debtData);

// Banking endpoints
export const getBankingTransactions = () => api.get('/banking');
export const createBankingTransaction = (transactionData: any) =>
  api.post('/banking', transactionData);

export default api;
