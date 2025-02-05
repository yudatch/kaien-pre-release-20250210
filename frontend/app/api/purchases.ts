import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Purchase, CreatePurchaseData, UpdatePurchaseData } from '../types/models/purchase';
import { PurchaseOrder, UpdateDeliveryData } from '../types/models/purchaseOrder';
import { ApiResponse } from '../types/api';
import { Supplier } from '../types/components/features/purchases';

export const purchasesApi = {
  // 発注一覧の取得
  getOrders: async (): Promise<ApiResponse<PurchaseOrder[]>> => {
    const response = await api.get<ApiResponse<PurchaseOrder[]>>(ENDPOINTS.PURCHASES.BASE);
    return response.data;
  },

  // 発注詳細の取得
  getOrder: async (id: string): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await api.get<ApiResponse<PurchaseOrder>>(ENDPOINTS.PURCHASES.DETAIL(id));
    return response.data;
  },

  // 発注の作成
  createOrder: async (data: CreatePurchaseData): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await api.post<ApiResponse<PurchaseOrder>>(ENDPOINTS.PURCHASES.BASE, data);
    return response.data;
  },

  // 発注の更新
  updateOrder: async (id: string, data: UpdatePurchaseData): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await api.put<ApiResponse<PurchaseOrder>>(ENDPOINTS.PURCHASES.DETAIL(id), data);
    return response.data;
  },

  // 発注ステータスの更新（承認/却下）
  updateOrderStatus: async (id: string, data: { status: 'approved' | 'rejected', notes: string }): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void>>(ENDPOINTS.PURCHASES.STATUS(id), data);
    return response.data;
  },

  // 納品状態の更新
  updateDeliveryStatus: async (orderId: string, itemId: string, data: UpdateDeliveryData): Promise<ApiResponse<void>> => {
    const response = await api.patch<ApiResponse<void>>(ENDPOINTS.PURCHASES.DELIVERY(orderId, itemId), data);
    return response.data;
  },

  // 発注の削除
  deleteOrder: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(ENDPOINTS.PURCHASES.DETAIL(id));
    return response.data;
  },

  // マスターデータの取得
  getMasterProducts: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(ENDPOINTS.PURCHASES.MASTER.PRODUCTS);
    return response.data;
  },

  getMasterSuppliers: async (): Promise<ApiResponse<Supplier[]>> => {
    const response = await api.get<ApiResponse<Supplier[]>>(ENDPOINTS.PURCHASES.MASTER.SUPPLIERS);
    return response.data;
  }
}; 