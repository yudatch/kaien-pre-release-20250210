import { PaymentMethod, PaymentStatus, Timestamps, UserReference } from '../common';

export type PaymentStatusJP = '未入金' | '一部入金' | '入金済';

export interface Payment extends Timestamps, UserReference {
  id: string;
  paymentNumber: string;
  customerId: string;
  invoiceId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
  customer?: {
    name: string;
  };
  invoice?: {
    documentNumber: string;
  };
}

export interface PaymentFormData extends Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'customer' | 'invoice'> {}

export interface PaymentListItem extends Pick<Payment, 'id' | 'paymentNumber' | 'paymentDate' | 'amount' | 'notes'> {
  customerName: string;
  invoiceNumber: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatusJP;
} 