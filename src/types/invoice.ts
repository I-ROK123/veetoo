export type InvoiceStatus = 'pending' | 'approved' | 'cleared' | 'rejected';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface Invoice {
  id: string;
  salesPersonId: string;
  salesPersonName: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
  qrCode?: string;
  imageUrl?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  imageUrl?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}