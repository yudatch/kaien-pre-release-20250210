import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Document, DocumentFormData } from '../types/models/document';
import { QuotationResponse, InvoiceResponse, QuotationUpdateData, InvoiceUpdateData } from '../types/api/documents';
import { ApiResponse } from '../types/api';

export const documentsApi = {
  getQuotations: async (): Promise<ApiResponse<Document[]>> => {
    const response = await api.get<ApiResponse<Document[]>>(ENDPOINTS.DOCUMENTS.QUOTATIONS.LIST);
    return response.data;
  },

  getInvoices: async (): Promise<ApiResponse<Document[]>> => {
    const response = await api.get<ApiResponse<Document[]>>(ENDPOINTS.DOCUMENTS.INVOICES.LIST);
    return response.data;
  },

  getQuotation: async (projectId: string): Promise<QuotationResponse> => {
    const response = await api.get<QuotationResponse>(ENDPOINTS.DOCUMENTS.QUOTATIONS.GET(Number(projectId)));
    return response.data;
  },

  getInvoice: async (projectId: string): Promise<InvoiceResponse> => {
    const response = await api.get<InvoiceResponse>(ENDPOINTS.DOCUMENTS.INVOICES.GET(Number(projectId)));
    return response.data;
  },

  createQuotation: async (data: DocumentFormData): Promise<QuotationResponse> => {
    const response = await api.post<QuotationResponse>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.CREATE,
      data
    );
    return response.data;
  },

  createInvoice: async (data: DocumentFormData): Promise<InvoiceResponse> => {
    const response = await api.post<InvoiceResponse>(
      ENDPOINTS.DOCUMENTS.INVOICES.CREATE,
      data
    );
    return response.data;
  },

  updateQuotation: async (projectId: string, data: QuotationUpdateData): Promise<QuotationResponse> => {
    const response = await api.put<QuotationResponse>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.UPDATE(Number(projectId)),
      data
    );
    return response.data;
  },

  updateInvoice: async (projectId: string, data: InvoiceUpdateData): Promise<InvoiceResponse> => {
    const response = await api.put<InvoiceResponse>(
      ENDPOINTS.DOCUMENTS.INVOICES.UPDATE(Number(projectId)),
      data
    );
    return response.data;
  },

  deleteQuotation: async (quotationId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(ENDPOINTS.DOCUMENTS.QUOTATIONS.DELETE(quotationId));
    return response.data;
  },

  deleteInvoice: async (invoiceId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(ENDPOINTS.DOCUMENTS.INVOICES.DELETE(invoiceId));
    return response.data;
  }
}; 