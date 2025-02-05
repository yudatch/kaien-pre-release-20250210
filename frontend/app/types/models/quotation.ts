import { BaseDocument, DocumentDetail } from './document';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuotationDetail extends DocumentDetail {}

export interface Quotation extends BaseDocument {
  quotation_id: number;
  quotation_number: string;
  project_id: number;
  issue_date: Date;
  valid_until: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: QuotationStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

export type QuotationDetailFormData = Omit<QuotationDetail, 'detail_id' | 'amount'>;

export interface QuotationFormData extends Omit<Quotation, 'quotation_id' | 'created_at' | 'updated_at' | 'project' | 'details'> {
  details: QuotationDetailFormData[];
} 