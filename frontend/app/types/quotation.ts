export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface Quotation {
  quotation_id: number;
  quotation_number: string;
  project_id: number;
  issue_date: string;
  valid_until: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: QuotationStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by?: number;
} 