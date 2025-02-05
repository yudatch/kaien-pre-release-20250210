import { PaymentMethod } from '../../../common';
import { PaymentStatusJP } from '../../../models/payment';

export interface ProjectPaymentListItem {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  invoiceNumber: string;
  paymentDate: string;
  amount: number;
  method: string;
  status: PaymentStatusJP;
} 