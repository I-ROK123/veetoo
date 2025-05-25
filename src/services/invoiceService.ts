import api from './api';
import { Invoice, InvoiceStatus } from '../types/invoice';

export const invoiceService = {
  uploadInvoice: async (invoiceData: FormData) => {
    try {
      const response = await api.post('/invoice/upload', invoiceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getInvoicesBySalesperson: async (salesPersonId: string, status?: InvoiceStatus) => {
    try {
      const url = status 
        ? `/salesperson/${salesPersonId}/invoices?status=${status}`
        : `/salesperson/${salesPersonId}/invoices`;
      
      const response = await api.get(url);
      return response.data as Invoice[];
    } catch (error) {
      throw error;
    }
  },
  
  getInvoiceById: async (invoiceId: string) => {
    try {
      const response = await api.get(`/invoice/${invoiceId}`);
      return response.data as Invoice;
    } catch (error) {
      throw error;
    }
  },
  
  approveInvoice: async (invoiceId: string) => {
    try {
      const response = await api.put(`/invoice/${invoiceId}/approve`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  submitPayment: async (invoiceId: string, paymentData: FormData) => {
    try {
      const response = await api.post(`/invoice/${invoiceId}/payment`, paymentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  approvePayment: async (invoiceId: string, paymentId: string) => {
    try {
      const response = await api.put(`/invoice/${invoiceId}/payment/${paymentId}/approve`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  rejectPayment: async (invoiceId: string, paymentId: string, reason: string) => {
    try {
      const response = await api.put(`/invoice/${invoiceId}/payment/${paymentId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};