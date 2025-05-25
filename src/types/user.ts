export type UserRole = 'salesperson' | 'supervisor' | 'ceo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  region?: string;
  dateJoined: string;
  isActive: boolean;
}

export interface SalesPerson extends User {
  role: 'salesperson';
  supervisorId: string;
  supervisorName: string;
  totalDebt: number;
  dailySavings: number;
  isFlagged: boolean;
}

export interface Supervisor extends User {
  role: 'supervisor';
  salesPersonCount: number;
  regions: string[];
}

export interface CEO extends User {
  role: 'ceo';
}