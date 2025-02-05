export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  invoice_id: number;
  invoice_number: string;
  project_id: number;
  quotation_id: number;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by?: number;
} 