import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { Document, DocumentFormData } from '../types/models/document';
import { QuotationResponse, InvoiceResponse, QuotationUpdateData, InvoiceUpdateData } from '../types/api/documents';
import { ApiResponse } from '../types/api';

type ApiErrorResponse = Omit<ApiResponse<never>, 'data'> & {
  success: false;
  message: string;
};

type ApiSuccessResponse<T> = ApiResponse<T> & {
  success: true;
  data: T;
};

export const documentsApi = {
  getQuotations: async (): Promise<ApiResponse<Document[]>> => {
    const response = await api.get<ApiResponse<Document[]> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.LIST
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<Document[]>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch quotations');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  getInvoices: async (): Promise<ApiResponse<Document[]>> => {
    const response = await api.get<ApiResponse<Document[]> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.LIST
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<Document[]>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch invoices');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  getQuotation: async (projectId: string): Promise<ApiResponse<QuotationResponse>> => {
    const response = await api.get<ApiResponse<QuotationResponse> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.GET(Number(projectId))
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<QuotationResponse>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  getInvoice: async (projectId: string): Promise<ApiResponse<InvoiceResponse>> => {
    const response = await api.get<ApiResponse<InvoiceResponse> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.GET(Number(projectId))
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<InvoiceResponse>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to fetch invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  createQuotation: async (data: DocumentFormData): Promise<ApiResponse<QuotationResponse>> => {
    const response = await api.post<ApiResponse<QuotationResponse> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.CREATE,
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<QuotationResponse>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to create quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  createInvoice: async (data: DocumentFormData): Promise<ApiResponse<InvoiceResponse>> => {
    const response = await api.post<ApiResponse<InvoiceResponse> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.CREATE,
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<InvoiceResponse>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to create invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  updateQuotation: async (projectId: string, data: QuotationUpdateData): Promise<ApiResponse<QuotationResponse>> => {
    const response = await api.put<ApiResponse<QuotationResponse> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.UPDATE(Number(projectId)),
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<QuotationResponse>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to update quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  updateInvoice: async (projectId: string, data: InvoiceUpdateData): Promise<ApiResponse<InvoiceResponse>> => {
    const response = await api.put<ApiResponse<InvoiceResponse> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.UPDATE(Number(projectId)),
      data
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<InvoiceResponse>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to update invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  deleteQuotation: async (quotationId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.QUOTATIONS.DELETE(quotationId)
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<void>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to delete quotation');
    } else {
      throw new Error('Unexpected response format');
    }
  },

  deleteInvoice: async (invoiceId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void> | { message: string; success: boolean }>(
      ENDPOINTS.DOCUMENTS.INVOICES.DELETE(invoiceId)
    );
    if ('data' in response.data && 'success' in response.data) {
      return response.data as ApiResponse<void>;
    } else if ('message' in response.data && 'success' in response.data) {
      throw new Error(response.data.message || 'Failed to delete invoice');
    } else {
      throw new Error('Unexpected response format');
    }
  }
};  