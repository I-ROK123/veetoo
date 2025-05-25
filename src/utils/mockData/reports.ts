import { SalesDashboardStats, SupervisorDashboardStats, CEODashboardStats } from '../../types/report';

export const mockDashboardStats = {
  salesperson: {
    totalSales: 36450,
    pendingInvoices: 1,
    approvedInvoices: 1,
    clearedInvoices: 1,
    totalDebt: 12500,
    dailySavings: 1500,
    netDebt: 11000,
    isFlagged: false,
    recentInvoices: [
      {
        id: 'inv1',
        invoiceNumber: 'INV-1001',
        amount: 12500,
        date: '2024-06-01T09:30:00.000Z',
        status: 'pending'
      },
      {
        id: 'inv2',
        invoiceNumber: 'INV-1002',
        amount: 8750,
        date: '2024-06-02T14:15:00.000Z',
        status: 'approved'
      },
      {
        id: 'inv3',
        invoiceNumber: 'INV-1003',
        amount: 15200,
        date: '2024-06-04T08:45:00.000Z',
        status: 'cleared'
      }
    ],
    salesByWeek: [
      {
        week: 'Week 1',
        amount: 28500
      },
      {
        week: 'Week 2',
        amount: 36450
      },
      {
        week: 'Week 3',
        amount: 32200
      },
      {
        week: 'Week 4',
        amount: 41000
      }
    ]
  } as SalesDashboardStats,
  
  supervisor: {
    totalSales: 138000,
    pendingInvoices: 2,
    approvedInvoices: 3,
    clearedInvoices: 1,
    totalTeamDebt: 48700,
    totalProducts: 7,
    lowStockProducts: 2,
    salesPersonCount: 8,
    flaggedSalesPersons: 2,
    bankDeposits: 205000,
    salesByRegion: [
      {
        region: 'Eastleigh North',
        amount: 52000
      },
      {
        region: 'Eastleigh South',
        amount: 45000
      },
      {
        region: 'Eastleigh Central',
        amount: 41000
      }
    ],
    topSalesPersons: [
      {
        id: 'sp1',
        name: 'John Mwangi',
        sales: 36450
      },
      {
        id: 'sp2',
        name: 'Alice Kamau',
        sales: 24100
      },
      {
        id: 'sp3',
        name: 'David Odhiambo',
        sales: 11250
      }
    ],
    productPerformance: [
      {
        id: 'prod1',
        name: 'Brookside Long Life Milk 500ml',
        quantity: 250
      },
      {
        id: 'prod2',
        name: 'Brookside Long Life Milk 1L',
        quantity: 180
      },
      {
        id: 'prod5',
        name: 'Brookside Yoghurt Vanilla 500ml',
        quantity: 20
      }
    ]
  } as SupervisorDashboardStats,
  
  ceo: {
    totalSales: 350000,
    salesGrowth: 12.5,
    totalDebt: 86000,
    debtChange: -5.2,
    totalInventoryValue: 127500,
    inventoryChange: 3.8,
    bankDeposits: 205000,
    depositsChange: 8.3,
    salesPersonCount: 14,
    flaggedSalesPersons: 3,
    topProducts: [
      {
        id: 'prod1',
        name: 'Brookside Long Life Milk 500ml',
        sales: 85000
      },
      {
        id: 'prod2',
        name: 'Brookside Long Life Milk 1L',
        sales: 72000
      },
      {
        id: 'prod4',
        name: 'Brookside Yoghurt Strawberry 250ml',
        sales: 42500
      }
    ],
    salesByMonth: [
      {
        month: 'January',
        amount: 280000
      },
      {
        month: 'February',
        amount: 295000
      },
      {
        month: 'March',
        amount: 310000
      },
      {
        month: 'April',
        amount: 325000
      },
      {
        month: 'May',
        amount: 340000
      },
      {
        month: 'June',
        amount: 350000
      }
    ],
    debtByRegion: [
      {
        region: 'Eastleigh North',
        amount: 35000
      },
      {
        region: 'Eastleigh South',
        amount: 28000
      },
      {
        region: 'Eastleigh Central',
        amount: 15000
      },
      {
        region: 'Eastleigh West',
        amount: 8000
      }
    ],
    inventoryStatus: {
      normal: 5,
      low: 1,
      critical: 1
    }
  } as CEODashboardStats
};