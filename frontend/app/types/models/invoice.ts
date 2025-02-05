import { BaseDocument, DocumentDetail } from './document';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';

export interface InvoiceDetail extends DocumentDetail {}

export interface Invoice extends BaseDocument {
  invoice_id: number;
  invoice_number: string;
  project_id: number;
  quotation_id: number;
  issue_date: Date;
  due_date: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

export type InvoiceDetailFormData = Omit<InvoiceDetail, 'detail_id' | 'amount'>;

export interface InvoiceFormData extends Omit<Invoice, 'invoice_id' | 'created_at' | 'updated_at' | 'project' | 'details'> {
  details: InvoiceDetailFormData[];
} 