import { StockTransaction } from '../../types/store';

export const mockTransactions: StockTransaction[] = [
  {
    id: 'tx1',
    productId: 'prod1',
    productName: 'Brookside Long Life Milk 500ml',
    quantity: 100,
    type: 'in',
    date: '2024-06-01T08:00:00.000Z',
    notes: 'Weekly restocking',
    createdBy: 'Sarah Kiprop'
  },
  {
    id: 'tx2',
    productId: 'prod1',
    productName: 'Brookside Long Life Milk 500ml',
    quantity: 25,
    type: 'out',
    date: '2024-06-01T09:30:00.000Z',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    notes: 'Daily allocation',
    createdBy: 'Sarah Kiprop'
  },
  {
    id: 'tx3',
    productId: 'prod2',
    productName: 'Brookside Long Life Milk 1L',
    quantity: 75,
    type: 'in',
    date: '2024-06-01T08:15:00.000Z',
    notes: 'Weekly restocking',
    createdBy: 'Sarah Kiprop'
  },
  {
    id: 'tx4',
    productId: 'prod2',
    productName: 'Brookside Long Life Milk 1L',
    quantity: 20,
    type: 'out',
    date: '2024-06-01T09:45:00.000Z',
    salesPersonId: 'sp2',
    salesPersonName: 'Alice Kamau',
    notes: 'Daily allocation',
    createdBy: 'Sarah Kiprop'
  },
  {
    id: 'tx5',
    productId: 'prod3',
    productName: 'Brookside Fresh Milk 500ml',
    quantity: 50,
    type: 'in',
    date: '2024-06-02T07:30:00.000Z',
    notes: 'Fresh delivery',
    createdBy: 'Michael Otieno'
  },
  {
    id: 'tx6',
    productId: 'prod3',
    productName: 'Brookside Fresh Milk 500ml',
    quantity: 15,
    type: 'out',
    date: '2024-06-02T09:00:00.000Z',
    salesPersonId: 'sp3',
    salesPersonName: 'David Odhiambo',
    notes: 'Daily allocation',
    createdBy: 'Michael Otieno'
  },
  {
    id: 'tx7',
    productId: 'prod5',
    productName: 'Brookside Yoghurt Vanilla 500ml',
    quantity: 40,
    type: 'in',
    date: '2024-06-03T08:30:00.000Z',
    notes: 'Weekly restocking',
    createdBy: 'Sarah Kiprop'
  },
  {
    id: 'tx8',
    productId: 'prod5',
    productName: 'Brookside Yoghurt Vanilla 500ml',
    quantity: 10,
    type: 'out',
    date: '2024-06-03T10:15:00.000Z',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    notes: 'Daily allocation',
    createdBy: 'Sarah Kiprop'
  }
];