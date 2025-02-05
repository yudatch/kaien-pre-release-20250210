import { Timestamps, UserReference } from '../common';
import { ApprovalStatus } from '../common/status';

export interface PurchaseOrderDetail {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  deliveryStatus: 'pending' | 'partial' | 'received';
  receivedQuantity?: number;
  receivedDate?: string;
  product: {
    name: string;
    code: string;
  };
}

export interface PurchaseOrder extends Timestamps, UserReference {
  id: number;
  orderNumber: string;
  supplierId: number;
  projectId: number | null;
  orderDate: string;
  deliveryDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'pending' | 'ordered' | 'received' | 'cancelled';
  approvalStatus: ApprovalStatus;
  notes?: string;
  approvedBy?: number;
  approvedAt?: string;
  supplier: {
    name: string;
    code: string;
  };
  project?: {
    name: string;
  };
  details: PurchaseOrderDetail[];
}

export interface PurchaseOrderFormData extends Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'supplier' | 'project' | 'details'> {
  details: Omit<PurchaseOrderDetail, 'id' | 'orderId' | 'amount' | 'deliveryStatus' | 'receivedQuantity' | 'receivedDate' | 'product'>[];
}

export interface ReceiveItem {
  detailId: number;
  productId: number;
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  deliveryStatus: 'pending' | 'partial' | 'received';
}

export interface PurchaseFormErrors {
  supplierId?: string;
  deliveryDate?: string;
  items?: string[];
}

export interface PurchaseListItem {
  id: string;
  orderNumber: string;
  supplierName: string;
  projectName?: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  status: string;
}

export interface Purchase {
  id: string;
  orderId: string;
  supplierId: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseData {
  supplierId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
}

export interface UpdatePurchaseData {
  supplierId?: string;
  items?: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  status?: 'pending' | 'approved' | 'rejected';
} 