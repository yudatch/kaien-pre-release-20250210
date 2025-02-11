import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Invoice } from '../types/models/invoice';
import { CreateInvoiceRequest, UpdateInvoiceRequest } from '../types/api/invoices';
import { ApiResponse } from '../types/api';

export const invoicesApi = {
  getList: async () => {
    const response = await api.get<ApiResponse<Invoice[]> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.LIST
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch invoices');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  getDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Invoice> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.GET(Number(id))
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  create: async (data: Omit<Invoice, 'id'>) => {
    const response = await api.post<ApiResponse<Invoice> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.CREATE,
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to create invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  update: async (id: string, data: Partial<Invoice>) => {
    const response = await api.put<ApiResponse<Invoice> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.UPDATE(Number(id)),
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to update invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.DELETE(Number(id))
    );
    if ('data' in response.data && 'success' in response.data) {
      return;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to delete invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  }
};   