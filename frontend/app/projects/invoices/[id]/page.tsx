"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { Document } from '@/app/types/models/document';
import { documentsApi } from '@/app/api/documents';
import { ApiResponse } from '@/app/types/api';
import { InvoiceResponse } from '@/app/types/api/documents';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [invoice, setInvoice] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await documentsApi.getInvoice(id);
        if (response) {
          setInvoice(response as unknown as Document);
        } else {
          setError('請求書データの取得に失敗しました');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('請求書データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const formatCurrency = (value: number | undefined | null): string => {
    if (value == null) return '¥0';
    return `¥${value.toLocaleString()}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="請求書詳細" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/projects/invoices')}
          >
            一覧へ戻る
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => router.push(`/projects/invoices/${id}/edit`)}
          >
            編集
          </Button>
        </Box>
      </Box>
      <Box>
        {invoice && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <h2>請求書番号: {invoice.document_number}</h2>
            </Box>
            <Box sx={{ mb: 2 }}>
              <p>発行日: {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : '-'}</p>
              <p>プロジェクト: {invoice.project?.name || '-'}</p>
              <p>顧客名: {invoice.project?.customer?.name || '-'}</p>
            </Box>
            <Box sx={{ mb: 2 }}>
              <h3>明細</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>項目</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>数量</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>単価</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>金額</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.details?.map((detail, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.productName || '-'}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{detail.quantity || 0}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{formatCurrency(detail.unitPrice)}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>小計</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{formatCurrency(invoice.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>消費税（10%）</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{formatCurrency(invoice.tax_amount)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>合計</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{formatCurrency(invoice.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
} 