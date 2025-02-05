export interface Customer {
  id: number;
  name: string;
  postal_code: string;
  address: string;
}

export interface Project {
  id: number;
  name: string;
  Customer: Customer;
}

export interface DocumentDetail {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Document {
  id: number;
  documentNumber: string;
  type: 'quotation' | 'invoice';
  Project: Project;
  details: DocumentDetail[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface DocumentPreviewProps {
  type: '見積書' | '請求書';
  data: Document | null;
  projectId: string;
  isEditing: boolean;
  onEdit: (editedData: Document) => void;
  onSave: () => void;
}

export interface DocumentPreviewActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface EditableDocumentDetail extends DocumentDetail {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
} 