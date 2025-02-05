import { DocumentStatus, DocumentType } from '@/app/constants/document';
import { Timestamps, UserReference } from '../common';

// 明細の基本インターフェース
export interface DocumentDetail {
  detail_id?: number;
  product_id: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  quotation_detail_id?: number;
  invoice_detail_id?: number;
}

// 更新用の明細インターフェース
export interface UpdateDocumentDetail {
  detailId?: number;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  quotationDetailId?: number;
  invoiceDetailId?: number;
}

// 基本ドキュメントインターフェース
export interface BaseDocument extends Timestamps, UserReference {
  document_number: string;
  project_id: number;
  issue_date: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  status: DocumentStatus;
  project?: {
    name: string;
    customer?: {
      name: string;
      companyName?: string;
      postal_code?: string;
      address?: string;
    };
  };
  details: DocumentDetail[];
}

// 見積書固有のインターフェース
export interface Quotation extends BaseDocument {
  quotation_id: number;
  valid_until: Date;
}

// 請求書固有のインターフェース
export interface Invoice extends BaseDocument {
  invoice_id: number;
  quotation_id: number;
  due_date: Date;
}

// 支払い先情報のインターフェース
export interface PaymentInfo {
  bank_name: string;
  branch_name: string;
  account_type: string;
  account_number: string;
  account_holder: string;
}

// 税金計算方式
export type TaxCalculationType = '内税' | '外税';

// 共通ドキュメントインターフェース
export interface Document extends BaseDocument {
  type: DocumentType;
  quotation_id?: number;
  invoice_id?: number;
  due_date?: Date;
  valid_until?: Date;
  payment_info?: PaymentInfo;
  tax_calculation_type?: TaxCalculationType;
}

// フォームデータ用インターフェース
export interface DocumentFormData {
  document_number: string;
  project_id: number;
  type: DocumentType;
  issue_date: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: DocumentStatus;
  details: UpdateDocumentDetail[];
}

// 更新データ用インターフェース
export interface DocumentUpdateData {
  document_number: string;
  project_id: number;
  type: DocumentType;
  issue_date: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: DocumentStatus;
  details: UpdateDocumentDetail[];
}

// プレビュー用のプロパティ
export interface DocumentPreviewProps {
  type: '見積書' | '請求書';
  data: Document;
  project_id?: number;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: Document) => void;
  onCancel?: () => void;
  onError?: (message: string) => void;
}

// プレビューページ用のプロパティ
export interface DocumentPreviewPageComponentProps {
  type: DocumentType;
  formatData: (data: any) => Document;
}

// プレビューアクション用のプロパティ
export interface DocumentPreviewActionsProps {
  onPrint?: () => void;
  onDownload?: () => void;
  onSend?: () => void;
  onEdit?: () => void;
  align?: 'left' | 'center' | 'right';
}

export interface DocumentDetailData {
  detail_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  quotation_detail_id?: number;
  invoice_detail_id?: number;
}

export interface QuotationUpdateData {
  quotationId: number;
  details: UpdateDocumentDetail[];
  taxAmount: number;
  totalAmount: number;
  notes?: string;
}

export interface InvoiceUpdateData {
  invoiceId: number;
  details: UpdateDocumentDetail[];
  taxAmount: number;
  totalAmount: number;
  notes?: string;
} 