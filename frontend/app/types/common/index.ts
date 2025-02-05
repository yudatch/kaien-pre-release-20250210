export type Status = 'active' | 'inactive' | 'deleted';

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UserReference {
  createdBy?: string | number;
  updatedBy?: string | number;
  deletedBy?: string | number;
}

export interface MoneyAmount {
  amount: number;
  currency: string;
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
}

export interface Address {
  postalCode?: string;
  prefecture?: string;
  city?: string;
  streetAddress?: string;
  building?: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  position?: string;
  department?: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | '銀行振込' | '現金' | 'クレジットカード' | 'その他';
export type PaymentStatus = 'pending' | 'completed' | 'cancelled'; 