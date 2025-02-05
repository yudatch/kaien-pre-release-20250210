export const DOCUMENT_TYPES = {
  QUOTATION: '見積書',
  INVOICE: '請求書'
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPE_LABELS = {
  quotation: '見積書',
  invoice: '請求書'
} as const;

export const QUOTATION_STATUS_OPTIONS = [
  { value: 'draft', label: '下書き' },
  { value: 'sent', label: '送付済み' },
  { value: 'accepted', label: '承認済み' },
  { value: 'rejected', label: '却下' },
  { value: 'expired', label: '期限切れ' },
] as const;

export type QuotationStatus = typeof QUOTATION_STATUS_OPTIONS[number]['value'];

export const INVOICE_STATUS_OPTIONS = [
  { value: 'draft', label: '下書き' },
  { value: 'issued', label: '発行済み' },
  { value: 'paid', label: '入金済み' },
  { value: 'cancelled', label: 'キャンセル' },
  { value: 'overdue', label: '期限超過' },
] as const;

export type InvoiceStatus = typeof INVOICE_STATUS_OPTIONS[number]['value'];

export type DocumentStatus = QuotationStatus | InvoiceStatus; 