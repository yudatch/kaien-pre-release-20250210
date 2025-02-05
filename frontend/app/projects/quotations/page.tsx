"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Tab, Tabs, Chip, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { DataTable } from '@/app/components/core/display/DataTable';
import { Column, Action, DataTableProps } from '@/app/types/components/core/table';
import { documentsApi } from '@/app/api/documents';
import { Document } from '@/app/types/models/document';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import { DeleteConfirmDialog } from '@/app/components/core/feedback/DeleteConfirmDialog';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { useDelete } from '@/app/hooks/useDelete';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';

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
  accepted: { label: '承認済み', color: 'success' },
  rejected: { label: '却下', color: 'error' },
} as const;

// テーブルカラム定義
const tableColumns: Column<Document>[] = [
  {
    field: 'document_number',
    headerName: '見積番号',
    width: 150,
    renderCell: (params: any) => (
      <Link
        href={`/projects/${params.row.project_id}/quotation-preview`}
        color="primary"
        underline="hover"
      >
        {params.row.document_number || `QT-${params.row.quotation_id}`}
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
    headerName: '見積金額', 
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
    renderCell: ({ row }) => (
      <Chip
        label={statusConfig[row.status as keyof typeof statusConfig]?.label || row.status}
        color={statusConfig[row.status as keyof typeof statusConfig]?.color || 'default'}
        size="small"
      />
    )
  }
];

// ダミーテンプレートデータ
const dummyTemplates: Template[] = [
  {
    id: 1,
    name: '標準見積書テンプレート',
    description: '一般的な工事案件向けの標準テンプレート',
    lastModified: '2024-01-05'
  },
  // 他のダミーデータ...
];

export default function QuotationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [quotations, setQuotations] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: quotationToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<Document>({
    onSuccess: (deletedQuotation) => {
      setQuotations(quotations.filter(q => q.quotation_id !== deletedQuotation.quotation_id));
      setError(null);
      setSuccessMessage('見積書を削除しました。');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setSuccessMessage(null);
      setError(error.message);
    },
  });

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await documentsApi.getQuotations();
        if (response.success) {
          setQuotations(response.data);
        } else {
          setError('見積書データの取得に失敗しました');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('見積書データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  const executeDelete = async () => {
    if (!quotationToDelete?.quotation_id) return;
    try {
      await handleDeleteConfirm(() => documentsApi.deleteQuotation(Number(quotationToDelete.quotation_id)));
    } catch (error) {
      console.error('見積書の削除に失敗しました:', error);
      setError('見積書の削除に失敗しました');
    }
  };

  const quotationActions: Action<Document>[] = [
    {
      icon: <EditIcon />,
      tooltip: '編集',
      onClick: (quotation) => {
        if (quotation.project_id) {
          router.push(`/projects/${quotation.project_id}/quotation-preview?edit=true`);
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

  const templateActions: Action<Template>[] = [
    {
      icon: <EditIcon />,
      tooltip: '編集',
      onClick: (template) => router.push(`/projects/quotations/templates/${template.id}/edit`),
      color: 'primary'
    },
    {
      icon: <DeleteIcon />,
      tooltip: '削除',
      onClick: (template) => {
        if (confirm('このテンプレートを削除してもよろしいですか？')) {
          // テンプレート削除の処理
          console.log('Delete template:', template.id);
        }
      },
      color: 'error'
    }
  ];

  if (loading) return (
    <ListPageLayout title="見積書管理">
      <LoadingSpinner />
    </ListPageLayout>
  );

  return (
    <ListPageLayout
      title="見積書管理"
      // addButtonLabel="見積書作成"
      onAddClick={() => router.push('/projects/quotations/new')}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="見積書一覧" />
          <Tab label="テンプレート" />
        </Tabs>
      </Box>

      {error || deleteError ? (
        <FeedbackMessage message={error || deleteError} type="error" />
      ) : successMessage ? (
        <FeedbackMessage message={successMessage} type="success" />
      ) : null}

      {activeTab === 0 ? (
        <>
          <DataTable<Document>
            columns={tableColumns}
            rows={quotations}
            loading={loading}
            actions={quotationActions}
            getRowId={(row) => row.quotation_id || 0}
          />
          <DeleteConfirmDialog
            open={deleteDialogOpen}
            title="見積書の削除"
            targetName={quotationToDelete?.document_number || `QT-${quotationToDelete?.quotation_id}`}
            onCancel={handleDeleteCancel}
            onConfirm={executeDelete}
            isLoading={isDeleting}
          />
        </>
      ) : (
        <DataTable<Template>
          columns={[
            { field: 'name', headerName: 'テンプレート名', width: 200 },
            { field: 'description', headerName: '説明', width: 300 },
            { field: 'lastModified', headerName: '最終更新日', width: 150 }
          ]}
          rows={dummyTemplates}
          loading={loading}
          actions={templateActions}
          getRowId={(row) => row.id}
        />
      )}
    </ListPageLayout>
  );
} 