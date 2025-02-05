"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import { DataTable } from '@/app/components/core/display/DataTable';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { useDelete } from '@/app/hooks/useDelete';
import { Column } from '@/app/types/components/core/table';
import { Construction, ConstructionDetail } from '@/app/types/api/constructions';
import { getConstructions, getConstructionDetails, deleteConstructionDetail } from '@/app/api/constructions';
import Link from 'next/link';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned':
      return 'default';
    case 'in_progress':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'planned':
      return '準備中';
    case 'in_progress':
      return '進行中';
    case 'completed':
      return '完了';
    case 'cancelled':
      return '中止';
    default:
      return status;
  }
};

const tableColumns: Column<ConstructionDetail>[] = [
  { 
    field: 'Project',
    headerName: 'プロジェクト名',
    width: 200,
    renderCell: ({ row }) => (
      <Link 
        href={`/constructions/details/${row.construction_id}`}
        style={{ 
          textDecoration: 'none',
          color: '#1976d2',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = 'underline';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none';
        }}
      >
        {row.Project.project_name}
      </Link>
    )
  },
  { 
    field: 'construction_date', 
    headerName: '着工日', 
    width: 120,
    valueGetter: (params) => params.row.construction_date || ''
  },
  { 
    field: 'completion_date',
    headerName: '完了予定日',
    width: 120,
    valueGetter: (params) => params.row.completion_date || ''
  },
  { 
    field: 'status', 
    headerName: 'ステータス', 
    width: 120,
    renderCell: ({ row }) => (
      <Chip
        label={getStatusLabel(row.status)}
        color={getStatusColor(row.status)}
        size="small"
      />
    )
  },
  { 
    field: 'notes',
    headerName: '備考',
    width: 200,
    valueGetter: (params) => params.row.notes || ''
  },
  { 
    field: 'progress', 
    headerName: '進捗', 
    width: 120,
    renderCell: ({ row }) => (
      <Chip
        label={`${row.progress}%`}
        color={row.progress === 100 ? 'success' : 'primary'}
        size="small"
      />
    )
  },
];

export default function ConstructionListPage() {
  const router = useRouter();
  const [constructions, setConstructions] = useState<ConstructionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: constructionToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<ConstructionDetail>({
    onSuccess: (deletedConstruction) => {
      setConstructions(prev => prev.filter(c => c.construction_id !== deletedConstruction.construction_id));
      setSuccessMessage('工事情報を削除しました。');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.message || '削除中にエラーが発生しました。');
      setTimeout(() => setError(null), 3000);
    },
  });

  useEffect(() => {
    const fetchConstructions = async () => {
      try {
        const data = await getConstructionDetails();
        if (!data) {
          throw new Error('工事データの取得に失敗しました。');
        }
        setConstructions(data);
      } catch (error) {
        console.error('Error fetching constructions:', error);
        setError(error instanceof Error ? error.message : '工事データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchConstructions();
  }, []);

  const handleDelete = async (construction: ConstructionDetail) => {
    handleDeleteClick(construction);
  };

  const executeDelete = async () => {
    if (!constructionToDelete) return;
    
    try {
      await handleDeleteConfirm(async () => {
        await deleteConstructionDetail(constructionToDelete.construction_id);
        return { success: true, data: constructionToDelete };
      });
    } catch (error) {
      console.error('Delete error:', error);
      setError('削除処理中にエラーが発生しました。');
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    if (deleteDialogOpen && constructionToDelete) {
      executeDelete();
    }
  }, [deleteDialogOpen, constructionToDelete]);

  if (loading) {
    return (
      <ListPageLayout title="工事一覧">
        <LoadingSpinner />
      </ListPageLayout>
    );
  }

  return (
    <ListPageLayout
      title="工事一覧"
      addButtonLabel="工事情報登録"
      onAddClick={() => router.push('/constructions/details/new')}
    >
      {(error || deleteError) && (
        <FeedbackMessage message={error || deleteError} type="error" />
      )}
      {successMessage && (
        <FeedbackMessage message={successMessage} type="success" />
      )}

      <DataTable<ConstructionDetail>
        columns={tableColumns}
        rows={constructions}
        loading={loading || isDeleting}
        getRowId={(row) => row.construction_id}
        actions={[
          {
            icon: <EditIcon />,
            tooltip: '編集',
            onClick: (construction) => router.push(`/constructions/details/${construction.construction_id}/edit`),
          },
          {
            icon: <DeleteIcon />,
            tooltip: '削除',
            onClick: handleDelete,
            color: 'error'
          }
        ]}
      />
    </ListPageLayout>
  );
} 