import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Invoice } from '../types/models/invoice';
import { CreateInvoiceRequest, UpdateInvoiceRequest } from '../types/api/invoices';
import { ApiResponse } from '../types/api';

export const invoicesApi = {
  getList: async () => {
    const response = await api.get<ApiResponse<Invoice[]>>(ENDPOINTS.DOCUMENTS.INVOICES.LIST);
    return response.data.data;
  },

  getDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Invoice>>(ENDPOINTS.DOCUMENTS.INVOICES.GET(Number(id)));
    return response.data.data;
  },

  create: async (data: Omit<Invoice, 'id'>) => {
    const response = await api.post<ApiResponse<Invoice>>(ENDPOINTS.DOCUMENTS.INVOICES.CREATE, data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Invoice>) => {
    const response = await api.put<ApiResponse<Invoice>>(ENDPOINTS.DOCUMENTS.INVOICES.UPDATE(Number(id)), data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(ENDPOINTS.DOCUMENTS.INVOICES.DELETE(Number(id)));
  }
}; 