import { PurchaseOrder, PurchaseOrderDetail } from '../models/purchase';

export interface PurchaseFormErrors {
  supplierId?: string;
  deliveryDate?: string;
  items?: string[];
}

export interface PurchaseFormState {
  order: PurchaseOrder | null;
  errors: PurchaseFormErrors;
  loading: boolean;
  selectedProduct: {
    id: number;
    name: string;
    code: string;
    price: number;
    taxRate: number;
  } | null;
}

export interface ReceiveFormData {
  orderId: number;
  details: Array<{
    detailId: number;
    receivedQuantity: number;
    receivedDate: string;
  }>;
}

export interface FormErrors {
  [key: string]: string;
} 