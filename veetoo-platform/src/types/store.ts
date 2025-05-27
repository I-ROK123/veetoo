export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  unitPrice: number;
  quantityInStock: number;
  reorderLevel: number;
  imageUrl?: string;
  isActive: boolean;
}

export type TransactionType = 'in' | 'out';

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: TransactionType;
  date: string;
  salesPersonId?: string;
  salesPersonName?: string;
  notes?: string;
  createdBy: string;
}