export interface BankDeposit {
  id: string;
  amount: number;
  date: string;
  bankName: string;
  accountNumber: string;
  referenceNumber: string;
  depositedBy: string;
  depositedByName: string;
  notes?: string;
  receiptImageUrl?: string;
}

export interface DebtPayment {
  id: string;
  salesPersonId: string;
  salesPersonName: string;
  amount: number;
  date: string;
  type: 'daily-saving' | 'debt-payment';
  notes?: string;
  recordedBy: string;
}

export interface DebtSummary {
  salesPersonId: string;
  salesPersonName: string;
  totalDebt: number;
  totalSavings: number;
  netDebt: number;
  isFlagged: boolean;
  debtThreshold: number;
  lastPaymentDate?: string;
  paymentHistory: DebtPayment[];
}