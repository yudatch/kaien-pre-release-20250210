"use client";

import { useParams, useRouter } from 'next/navigation';
import { DocumentPreviewPage } from '@/app/components/documents/DocumentPreviewPage';
import { Document } from '@/app/types/models/document';
import { documentsApi } from '@/app/api/documents';
import { DOCUMENT_TYPES } from '@/app/constants/document';

export default function InvoicePreviewPage() {
  const params = useParams();
  const id = params?.id ? (typeof params.id === 'string' ? params.id : params.id[0]) : '';

  const formatData = (responseData: any): Document => {
    console.log('API Response:', responseData);

    const data = responseData.data || responseData;

    if (!data) {
      throw new Error('Invalid API response format');
    }

    const details = (data.details || []).map((detail: any) => ({
      detail_id: detail.detail_id,
      product_id: detail.product_id,
      productName: detail.productName,
      quantity: detail.quantity,
      unit: detail.unit,
      unitPrice: Math.floor(detail.unitPrice),
      amount: Math.floor(detail.quantity * detail.unitPrice)
    }));

    // 内税計算
    const detailsTotal = details.reduce((sum: number, detail: { amount: number }) => sum + Math.floor(Number(detail.amount)), 0);
    const total_amount = detailsTotal;  // 明細合計を税込金額として扱う
    const subtotal = Math.floor(total_amount / 1.1);  // 税抜金額を逆算
    const tax_amount = total_amount - subtotal;  // 消費税額を計算

    return {
      document_number: data.document_number || '',
      project_id: data.project_id || 0,
      type: DOCUMENT_TYPES.INVOICE,
      issue_date: data.issue_date ? new Date(data.issue_date) : new Date(),
      subtotal: subtotal,
      tax_amount: tax_amount,
      total_amount: total_amount,
      status: data.status || 'draft',
      tax_calculation_type: data.tax_calculation_type || '内税',
      project: {
        name: data.projectName || '',
        customer: {
          name: data.customerName || '',
          postal_code: data.customerPostalCode || '',
          address: data.customerAddress || ''
        }
      },
      payment_info: {
        bank_name: process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME || '',
        branch_name: process.env.NEXT_PUBLIC_PAYMENT_BRANCH_NAME || '',
        account_type: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_TYPE || '',
        account_number: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER || '',
        account_holder: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_HOLDER || ''
      },
      details,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    };
  };

  return (
    <DocumentPreviewPage
      type={DOCUMENT_TYPES.INVOICE}
      formatData={formatData}
      fetchDocument={documentsApi.getInvoice}
    />
  );
}