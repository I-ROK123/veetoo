import { BankDeposit, DebtPayment } from '../../types/banking';

export const mockDeposits: BankDeposit[] = [
  {
    id: 'dep1',
    amount: 45000,
    date: '2024-06-01T16:30:00.000Z',
    bankName: 'Equity Bank',
    accountNumber: '0123456789',
    referenceNumber: 'DEP-1001',
    depositedBy: 'sv1',
    depositedByName: 'Sarah Kiprop',
    notes: 'Daily sales deposit',
    receiptImageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg'
  },
  {
    id: 'dep2',
    amount: 38500,
    date: '2024-06-02T16:45:00.000Z',
    bankName: 'Equity Bank',
    accountNumber: '0123456789',
    referenceNumber: 'DEP-1002',
    depositedBy: 'sv1',
    depositedByName: 'Sarah Kiprop',
    notes: 'Daily sales deposit',
    receiptImageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg'
  },
  {
    id: 'dep3',
    amount: 42800,
    date: '2024-06-03T16:15:00.000Z',
    bankName: 'Equity Bank',
    accountNumber: '0123456789',
    referenceNumber: 'DEP-1003',
    depositedBy: 'sv1',
    depositedByName: 'Sarah Kiprop',
    notes: 'Daily sales deposit',
    receiptImageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg'
  },
  {
    id: 'dep4',
    amount: 37200,
    date: '2024-06-01T16:20:00.000Z',
    bankName: 'KCB',
    accountNumber: '9876543210',
    referenceNumber: 'DEP-2001',
    depositedBy: 'sv2',
    depositedByName: 'Michael Otieno',
    notes: 'Daily sales deposit',
    receiptImageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg'
  },
  {
    id: 'dep5',
    amount: 41500,
    date: '2024-06-02T16:30:00.000Z',
    bankName: 'KCB',
    accountNumber: '9876543210',
    referenceNumber: 'DEP-2002',
    depositedBy: 'sv2',
    depositedByName: 'Michael Otieno',
    notes: 'Daily sales deposit',
    receiptImageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg'
  }
];

export const mockDebtPayments: DebtPayment[] = [
  {
    id: 'pay1',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    amount: 500,
    date: '2024-06-01T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Sarah Kiprop'
  },
  {
    id: 'pay2',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    amount: 500,
    date: '2024-06-02T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Sarah Kiprop'
  },
  {
    id: 'pay3',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    amount: 500,
    date: '2024-06-03T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Sarah Kiprop'
  },
  {
    id: 'pay4',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    amount: 2000,
    date: '2024-06-03T17:15:00.000Z',
    type: 'debt-payment',
    notes: 'Additional payment towards debt',
    recordedBy: 'Sarah Kiprop'
  },
  {
    id: 'pay5',
    salesPersonId: 'sp2',
    salesPersonName: 'Alice Kamau',
    amount: 500,
    date: '2024-06-01T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Sarah Kiprop'
  },
  {
    id: 'pay6',
    salesPersonId: 'sp2',
    salesPersonName: 'Alice Kamau',
    amount: 500,
    date: '2024-06-02T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Sarah Kiprop'
  },
  {
    id: 'pay7',
    salesPersonId: 'sp3',
    salesPersonName: 'David Odhiambo',
    amount: 500,
    date: '2024-06-01T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Michael Otieno'
  },
  {
    id: 'pay8',
    salesPersonId: 'sp3',
    salesPersonName: 'David Odhiambo',
    amount: 500,
    date: '2024-06-02T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Michael Otieno'
  },
  {
    id: 'pay9',
    salesPersonId: 'sp3',
    salesPersonName: 'David Odhiambo',
    amount: 500,
    date: '2024-06-03T17:00:00.000Z',
    type: 'daily-saving',
    recordedBy: 'Michael Otieno'
  }
];