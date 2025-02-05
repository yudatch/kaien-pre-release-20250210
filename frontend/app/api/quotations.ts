import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Quotation } from '../types/models/quotation';
import { CreateQuotationRequest, UpdateQuotationRequest } from '../types/api/quotations';
import { ApiResponse } from '../types/api';

export const quotationsApi = {
  getList: async () => {
    const response = await api.get<ApiResponse<Quotation[]>>(ENDPOINTS.DOCUMENTS.QUOTATIONS.LIST);
    return response.data.data;
  },

  getDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Quotation>>(ENDPOINTS.DOCUMENTS.QUOTATIONS.GET(Number(id)));
    return response.data.data;
  },

  create: async (data: CreateQuotationRequest) => {
    const response = await api.post<ApiResponse<Quotation>>(ENDPOINTS.DOCUMENTS.QUOTATIONS.CREATE, data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateQuotationRequest) => {
    const response = await api.put<ApiResponse<Quotation>>(ENDPOINTS.DOCUMENTS.QUOTATIONS.UPDATE(Number(id)), data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(ENDPOINTS.DOCUMENTS.QUOTATIONS.DELETE(Number(id)));
  }
}; 