"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getConstructionDetails } from '@/app/api/constructions';
import { DataTable } from '@/app/components/core/display/DataTable';
import { Column } from '@/app/types/components/core/table';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Link from 'next/link';
import { ConstructionDetail } from '@/app/types/api/constructions';
import { Chip } from '@mui/material';

const statusConfig = {
  planned: { label: '計画中', color: 'default' },
  in_progress: { label: '進行中', color: 'primary' },
  completed: { label: '完了', color: 'success' },
  cancelled: { label: '中止', color: 'error' }
} as const;

const tableColumns: Column<ConstructionDetail>[] = [
  { field: 'construction_id', headerName: '工事番号', width: 120 },
  { 
    field: 'Project', 
    headerName: 'プロジェクト', 
    width: 200,
    renderCell: ({ row }) => (
      <Link 
        href={`/constructions/list/${row.construction_id}`}
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
        {row.Project?.project_name || ''}
      </Link>
    )
  },
  { 
    field: 'construction_date', 
    headerName: '着工日', 
    width: 120,
    valueGetter: ({ row }) => row.construction_date || ''
  },
  { 
    field: 'completion_date', 
    headerName: '完了予定日', 
    width: 120,
    valueGetter: ({ row }) => row.completion_date || ''
  },
  { 
    field: 'progress', 
    headerName: '進捗', 
    width: 100,
    valueGetter: ({ row }) => `${row.progress}%`
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

export function ConstructionList() {
  const router = useRouter();
  const [constructions, setConstructions] = useState<ConstructionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConstructions = async () => {
      try {
        const data = await getConstructionDetails();
        setConstructions(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('工事データの取得に失敗しました'));
      } finally {
        setLoading(false);
      }
    };

    fetchConstructions();
  }, []);

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  return (
    <DataTable<ConstructionDetail>
      columns={tableColumns}
      rows={constructions}
      loading={loading}
      actions={[
        {
          icon: <EditIcon />,
          tooltip: '編集',
          onClick: (construction) => router.push(`/constructions/list/${construction.construction_id}/edit`),
          color: 'primary'
        },
        {
          icon: <DeleteIcon />,
          tooltip: '削除',
          onClick: (construction) => {
            if (window.confirm('この工事情報を削除してもよろしいですか？')) {
              // TODO: 削除処理の実装
            }
          },
          color: 'error'
        }
      ]}
    />
  );
} 