import  api  from './api';
import { ReportType } from '../types/report';

export const reportService = {
  generateReport: async (
    reportType: ReportType,
    filters: {
      startDate: string;
      endDate: string;
      salesPersonId?: string;
      productId?: string;
      region?: string;
    }
  ) => {
    const response = await api.get(`/reports/${reportType}`, {
      params: filters,
      responseType: 'blob',
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from header or create one
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'report.xlsx';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/); 
      if (filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  },
  
  getDashboardStats: async (userRole: 'salesperson' | 'supervisor' | 'ceo', userId?: string) => {
    const url = userId 
      ? `/reports/${userRole}/dashboard?userId=${userId}`
      : `/reports/${userRole}/dashboard`;
      
    const response = await api.get(url);
    return response.data;
  }
};