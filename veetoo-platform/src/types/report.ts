export type ReportType = 
  | 'daily-sales' 
  | 'weekly-sales' 
  | 'monthly-sales'
  | 'inventory'
  | 'debt-summary'
  | 'banking';

export interface ReportFilter {
  startDate: string;
  endDate: string;
  salesPersonId?: string;
  productId?: string;
  region?: string;
}

export interface SalesDashboardStats {
  totalSales: number;
  pendingInvoices: number;
  approvedInvoices: number;
  clearedInvoices: number;
  totalDebt: number;
  dailySavings: number;
  netDebt: number;
  isFlagged: boolean;
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    amount: number;
    date: string;
    status: string;
  }[];
  salesByWeek: {
    week: string;
    amount: number;
  }[];
}

export interface SupervisorDashboardStats {
  totalSales: number;
  pendingInvoices: number;
  approvedInvoices: number;
  clearedInvoices: number;
  totalTeamDebt: number;
  totalProducts: number;
  lowStockProducts: number;
  salesPersonCount: number;
  flaggedSalesPersons: number;
  bankDeposits: number;
  salesByRegion: {
    region: string;
    amount: number;
  }[];
  topSalesPersons: {
    id: string;
    name: string;
    sales: number;
  }[];
  productPerformance: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

export interface CEODashboardStats {
  totalSales: number;
  salesGrowth: number;
  totalDebt: number;
  debtChange: number;
  totalInventoryValue: number;
  inventoryChange: number;
  bankDeposits: number;
  depositsChange: number;
  salesPersonCount: number;
  flaggedSalesPersons: number;
  topProducts: {
    id: string;
    name: string;
    sales: number;
  }[];
  salesByMonth: {
    month: string;
    amount: number;
  }[];
  debtByRegion: {
    region: string;
    amount: number;
  }[];
  inventoryStatus: {
    normal: number;
    low: number;
    critical: number;
  };
}