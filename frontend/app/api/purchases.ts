import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Purchase, CreatePurchaseData, UpdatePurchaseData } from '../types/models/purchase';
import { PurchaseOrder, UpdateDeliveryData } from '../types/models/purchaseOrder';
import { ApiResponse } from '../types/api';
import { Supplier } from '../types/components/features/purchases';

export const purchasesApi = {
  // 発注一覧の取得
  getOrders: async (): Promise<ApiResponse<PurchaseOrder[]>> => {
    const response = await api.get<ApiResponse<PurchaseOrder[]> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.BASE
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<PurchaseOrder[]>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch purchase orders');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  // 発注詳細の取得
  getOrder: async (id: string): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await api.get<ApiResponse<PurchaseOrder> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.DETAIL(id)
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<PurchaseOrder>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch purchase order');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  // 発注の作成
  createOrder: async (data: CreatePurchaseData): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await api.post<ApiResponse<PurchaseOrder> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.BASE,
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<PurchaseOrder>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to create purchase order');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  // 発注の更新
  updateOrder: async (id: string, data: UpdatePurchaseData): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await api.put<ApiResponse<PurchaseOrder> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.DETAIL(id),
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<PurchaseOrder>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to update purchase order');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  // 発注ステータスの更新（承認/却下）
  updateOrderStatus: async (id: string, data: { status: 'approved' | 'rejected', notes: string }): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.STATUS(id),
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<void>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to update order status');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  // 納品状態の更新
  updateDeliveryStatus: async (orderId: string, itemId: string, data: UpdateDeliveryData): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.DELIVERY(orderId, itemId),
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<void>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to update delivery status');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  // 発注の削除
  deleteOrder: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.DETAIL(id)
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<void>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to delete purchase order');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  // マスターデータの取得
  getMasterProducts: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.MASTER.PRODUCTS
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<any[]>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch master products');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  getMasterSuppliers: async (): Promise<ApiResponse<Supplier[]>> => {
    const response = await api.get<ApiResponse<Supplier[]> | { message: string; success: boolean }>(
      ENDPOINTS.PURCHASES.MASTER.SUPPLIERS
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<Supplier[]>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch master suppliers');
    } else {
      throw new Error('Unexpected response format');
    }
  }
};   