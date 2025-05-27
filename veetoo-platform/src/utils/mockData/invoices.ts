import { Invoice } from '../../types/invoice';

export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    invoiceNumber: 'INV-1001',
    amount: 12500,
    date: '2024-06-01T09:30:00.000Z',
    status: 'pending',
    qrCode: 'QR12345',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    payments: []
  },
  {
    id: 'inv2',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    invoiceNumber: 'INV-1002',
    amount: 8750,
    date: '2024-06-02T14:15:00.000Z',
    status: 'approved',
    qrCode: 'QR12346',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    approvedBy: 'Sarah Kiprop',
    approvedDate: '2024-06-02T16:30:00.000Z',
    payments: [
      {
        id: 'pay1',
        invoiceId: 'inv2',
        amount: 4000,
        date: '2024-06-03T10:20:00.000Z',
        status: 'approved',
        imageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg',
        approvedBy: 'Sarah Kiprop',
        approvedDate: '2024-06-03T11:45:00.000Z'
      }
    ]
  },
  {
    id: 'inv3',
    salesPersonId: 'sp1',
    salesPersonName: 'John Mwangi',
    invoiceNumber: 'INV-1003',
    amount: 15200,
    date: '2024-06-04T08:45:00.000Z',
    status: 'cleared',
    qrCode: 'QR12347',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    approvedBy: 'Sarah Kiprop',
    approvedDate: '2024-06-04T10:15:00.000Z',
    payments: [
      {
        id: 'pay2',
        invoiceId: 'inv3',
        amount: 15200,
        date: '2024-06-05T09:30:00.000Z',
        status: 'approved',
        imageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg',
        approvedBy: 'Sarah Kiprop',
        approvedDate: '2024-06-05T11:20:00.000Z'
      }
    ]
  },
  {
    id: 'inv4',
    salesPersonId: 'sp2',
    salesPersonName: 'Alice Kamau',
    invoiceNumber: 'INV-2001',
    amount: 9800,
    date: '2024-06-01T11:20:00.000Z',
    status: 'approved',
    qrCode: 'QR12348',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    approvedBy: 'Sarah Kiprop',
    approvedDate: '2024-06-01T13:45:00.000Z',
    payments: []
  },
  {
    id: 'inv5',
    salesPersonId: 'sp2',
    salesPersonName: 'Alice Kamau',
    invoiceNumber: 'INV-2002',
    amount: 14300,
    date: '2024-06-03T10:30:00.000Z',
    status: 'pending',
    qrCode: 'QR12349',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    payments: []
  },
  {
    id: 'inv6',
    salesPersonId: 'sp3',
    salesPersonName: 'David Odhiambo',
    invoiceNumber: 'INV-3001',
    amount: 11250,
    date: '2024-06-02T09:15:00.000Z',
    status: 'approved',
    qrCode: 'QR12350',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    approvedBy: 'Michael Otieno',
    approvedDate: '2024-06-02T11:30:00.000Z',
    payments: [
      {
        id: 'pay3',
        invoiceId: 'inv6',
        amount: 5000,
        date: '2024-06-04T14:20:00.000Z',
        status: 'pending',
        imageUrl: 'https://images.pexels.com/photos/7821487/pexels-photo-7821487.jpeg'
      }
    ]
  }
];