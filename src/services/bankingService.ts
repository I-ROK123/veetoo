import api from './api';
import { BankDeposit, DebtPayment } from '../types/banking';

export const bankingService = {
  recordDeposit: async (depositData: Omit<BankDeposit, 'id' | 'date'>) => {
    try {
      const response = await api.post('/banking/deposit', depositData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getDeposits: async (filters?: {
    startDate?: string;
    endDate?: string;
    supervisorId?: string;
  }) => {
    try {
      const response = await api.get('/banking/deposits', { params: filters });
      return response.data as BankDeposit[];
    } catch (error) {
      throw error;
    }
  },
  
  recordDebtPayment: async (paymentData: Omit<DebtPayment, 'id' | 'date'>) => {
    try {
      const response = await api.post('/banking/debt-payment', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getDebtPayments: async (salesPersonId: string) => {
    try {
      const response = await api.get(`/banking/debt-payments/${salesPersonId}`);
      return response.data as DebtPayment[];
    } catch (error) {
      throw error;
    }
  },
  
  getDebtSummary: async (salesPersonId: string) => {
    try {
      const response = await api.get(`/banking/debt-summary/${salesPersonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};