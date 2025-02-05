import { PaymentMethod, Timestamps, UserReference } from '../common';

export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Expense extends Timestamps, UserReference {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  status: ExpenseStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ExpenseFormData extends Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'approvedBy' | 'approvedAt'> {
  receiptImage?: File;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
} 