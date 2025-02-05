"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Tab, Tabs, Chip, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { DataTable } from '@/app/components/core/display/DataTable';
import { Column, Action } from '@/app/types/components/core/table';
import { documentsApi } from '@/app/api/documents';
import { Document } from '@/app/types/models/document';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import { DeleteConfirmDialog } from '@/app/components/core/feedback/DeleteConfirmDialog';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { useDelete } from '@/app/hooks/useDelete';

interface Template {
  id: number;
  name: string;
  description: string;
  lastModified: string;
}

// ステータス設定
const statusConfig = {
  draft: { label: '下書き', color: 'default' },
  sent: { label: '送付済み', color: 'primary' },
  paid: { label: '入金済み', color: 'success' },
  overdue: { label: '支払遅延', color: 'error' },
} as const;

const tableColumns: Column<Document>[] = [
  {
    field: 'document_number',
    headerName: '請求番号',
    width: 150,
    renderCell: (params: any) => (
      <Link
        href={`/projects/${params.row.project_id}/invoice-preview`}
        color="primary"
        underline="hover"
      >
        {params.row.document_number || `INV-${params.row.invoice_id}`}
      </Link>
    )
  },
  { 
    field: 'project_name', 
    headerName: '案件名', 
    width: 200, 
    valueGetter: ({ row }) => row.project?.name || '-'
  },
  { 
    field: 'customer_name', 
    headerName: '取引先', 
    width: 200, 
    valueGetter: ({ row }) => row.project?.customer?.name || '-'
  },
  { 
    field: 'total_amount', 
    headerName: '請求金額', 
    width: 150,
    valueGetter: ({ row }) => row.total_amount ? `¥${Math.floor(row.total_amount).toLocaleString()}` : '-'
  },
  { 
    field: 'issue_date', 
    headerName: '発行日', 
    width: 150,
    valueGetter: ({ row }) => row.issue_date ? new Date(row.issue_date).toLocaleDateString('ja-JP') : '-'
  },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 120,
    renderCell: (params: any) => (
      <Chip
        label={statusConfig[params.row.status as keyof typeof statusConfig]?.label || params.row.status}
        color={statusConfig[params.row.status as keyof typeof statusConfig]?.color || 'default'}
        size="small"
      />
    )
  }
];

// ダミーテンプレートデータ
const dummyTemplates: Template[] = [
  {
    id: 1,
    name: '標準請求書テンプレート',
    description: '一般的な工事案件向けの標準テンプレート',
    lastModified: '2024-01-05'
  },
];

export default function InvoicesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [invoices, setInvoices] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: invoiceToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<Document>({
    onSuccess: (deletedInvoice) => {
      setInvoices(invoices.filter(i => i.invoice_id !== deletedInvoice.invoice_id));
      setError(null);
      setSuccessMessage('請求書を削除しました。');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setSuccessMessage(null);
      setError(error.message);
    },
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await documentsApi.getInvoices();
        if (response.success) {
          setInvoices(response.data);
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

    fetchInvoices();
  }, []);

  const executeDelete = async () => {
    if (!invoiceToDelete?.invoice_id) return;
    try {
      await handleDeleteConfirm(() => documentsApi.deleteInvoice(Number(invoiceToDelete.invoice_id)));
    } catch (error) {
      console.error('請求書の削除に失敗しました:', error);
      setError('請求書の削除に失敗しました');
    }
  };

  const invoiceActions: Action<Document>[] = [
    {
      icon: <EditIcon />,
      tooltip: '編集',
      onClick: (invoice) => {
        if (invoice.project_id) {
          router.push(`/projects/${invoice.project_id}/invoice-preview?edit=true`);
        }
      },
      color: 'primary'
    },
    {
      icon: <DeleteIcon />,
      tooltip: '削除',
      onClick: handleDeleteClick,
      color: 'error'
    }
  ];

  if (loading) return (
    <ListPageLayout title="請求書管理">
      <LoadingSpinner />
    </ListPageLayout>
  );

  return (
    <ListPageLayout
      title="請求書管理"
      // addButtonLabel="請求書作成"
      onAddClick={() => router.push('/projects/invoices/new')}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="請求書一覧" />
          <Tab label="テンプレート" />
        </Tabs>
      </Box>

      {error || deleteError ? (
        <FeedbackMessage message={error || deleteError} type="error" />
      ) : successMessage ? (
        <FeedbackMessage message={successMessage} type="success" />
      ) : null}

      {activeTab === 0 ? (
        <DataTable<Document>
          columns={tableColumns}
          rows={invoices}
          loading={loading}
          actions={invoiceActions}
          getRowId={(row) => row.invoice_id || 0}
        />
      ) : (
        <DataTable<Template>
          columns={[
            { field: 'name', headerName: 'テンプレート名', width: 250 },
            { field: 'description', headerName: '説明', width: 400 },
            { field: 'lastModified', headerName: '最終更新日', width: 150 }
          ]}
          rows={dummyTemplates}
          getRowId={(row) => row.id}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="請求書の削除"
        targetName={invoiceToDelete?.document_number || `INV-${invoiceToDelete?.invoice_id}`}
        onCancel={handleDeleteCancel}
        onConfirm={executeDelete}
        isLoading={isDeleting}
      />
    </ListPageLayout>
  );
} 