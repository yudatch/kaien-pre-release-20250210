export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderNumber: string;
  orderDate: string;
  deliveryDate?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  totalAmount: number;
  notes?: string;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  deliveryStatus: 'pending' | 'partial' | 'completed';
  deliveredQuantity: number;
}

export interface UpdateDeliveryData {
  deliveryStatus: 'pending' | 'partial' | 'completed';
  deliveredQuantity: number;
  notes?: string;
} 