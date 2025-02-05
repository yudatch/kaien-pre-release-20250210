"use client";

import { useParams } from 'next/navigation';
import { DocumentPreviewPage } from '@/app/components/documents/DocumentPreviewPage';
import { DOCUMENT_TYPES } from '@/app/constants/document';
import { Document } from '@/app/types/models/document';
import { documentsApi } from '@/app/api/documents';

export default function QuotationPreviewPage() {
  const { id } = useParams();

  const formatData = (responseData: any): Document => {
    console.log('API Response:', responseData);

    const data = responseData.data || responseData;

    if (!data) {
      throw new Error('Invalid API response format');
    }

    const details = Array.isArray(data.details) ? data.details.map((detail: any) => ({
      detail_id: Number(detail.detail_id),
      product_id: Number(detail.product_id),
      productName: detail.productName || '',
      quantity: Number(detail.quantity),
      unit: detail.unit,
      unitPrice: detail.unitPrice ? Number(detail.unitPrice) : 0,
      amount: detail.amount ? Number(detail.amount) : 0,
      quotation_detail_id: detail.quotation_detail_id ? Number(detail.quotation_detail_id) : undefined,
      invoice_detail_id: detail.invoice_detail_id ? Number(detail.invoice_detail_id) : undefined
    })) : [];

    console.log('Converted details:', details);

    const subtotal = details.reduce((sum: number, detail: { amount: number }) => sum + Number(detail.amount), 0);
    const tax_amount = Math.round(subtotal * 0.1);
    const total_amount = subtotal + tax_amount;

    return {
      document_number: data.document_number || '',
      project_id: data.project_id || 0,
      type: 'quotation',
      issue_date: data.issue_date ? new Date(data.issue_date) : new Date(),
      subtotal: subtotal,
      tax_amount: tax_amount,
      total_amount: total_amount,
      status: data.status || 'draft',
      project: {
        name: data.projectName || '',
        customer: {
          name: data.customerName || '',
          postal_code: data.customerPostalCode || '',
          address: data.customerAddress || ''
        }
      },
      details,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    };
  };

  const fetchDocument = async (quotationId: string) => {
    try {
      const response = await documentsApi.getQuotation(quotationId);
      return response;
    } catch (error) {
      console.error('Error fetching quotation:', error);
      throw error;
    }
  };

  return (
    <DocumentPreviewPage
      type={DOCUMENT_TYPES.QUOTATION}
      formatData={formatData}
      fetchDocument={fetchDocument}
    />
  );
}