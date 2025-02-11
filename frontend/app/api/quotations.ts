import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Quotation } from '../types/models/quotation';
import { CreateQuotationRequest, UpdateQuotationRequest } from '../types/api/quotations';
import { ApiResponse } from '../types/api';

export const quotationsApi = {
  getList: async () => {
    const response = await api.get<ApiResponse<Quotation[]> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.LIST
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch quotations');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  getDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Quotation> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.GET(Number(id))
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  create: async (data: CreateQuotationRequest) => {
    const response = await api.post<ApiResponse<Quotation> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.CREATE,
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to create quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  update: async (id: string, data: UpdateQuotationRequest) => {
    const response = await api.put<ApiResponse<Quotation> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.UPDATE(Number(id)),
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data.data;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to update quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.DELETE(Number(id))
    );
    if ('data' in response.data && 'success' in response.data) {
      return;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to delete quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  }
};   