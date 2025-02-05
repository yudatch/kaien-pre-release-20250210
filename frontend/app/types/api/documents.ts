import { Document } from '../models/document';
import { BaseResponse } from '../common/api';

export interface DocumentDetail {
  detail_id: number;
  product_id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface QuotationResponseData {
  quotation_id: number;
  project_id: number;
  details?: DocumentDetail[];
  tax_amount: number;
  total_amount: number;
  notes?: string;
  project?: {
    name: string;
    customer?: {
      name: string;
      postal_code: string;
      address: string;
    }
  }
}

export interface InvoiceResponseData {
  invoice_id: number;
  project_id: number;
  details?: DocumentDetail[];
  tax_amount: number;
  total_amount: number;
  notes?: string;
  project?: {
    name: string;
    customer?: {
      name: string;
      postal_code: string;
      address: string;
    }
  }
}

export interface QuotationResponse extends BaseResponse<QuotationResponseData> {
  data: QuotationResponseData;
}

export interface InvoiceResponse extends BaseResponse<InvoiceResponseData> {
  data: InvoiceResponseData;
}

export interface QuotationUpdateData {
  quotationId: number;
  details: Array<{
    detailId?: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
}

export interface InvoiceUpdateData {
  invoiceId: number;
  details: Array<{
    detailId?: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
}

export type DocumentResponse = QuotationResponse | InvoiceResponse; 