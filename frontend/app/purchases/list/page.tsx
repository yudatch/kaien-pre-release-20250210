"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import { DataTable } from '@/app/components/core/display/DataTable';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { useDelete } from '@/app/hooks/useDelete';
import { Column } from '@/app/types/components/core/table';

type Purchase = {
  id: string;
  purchaseNumber: string;
  supplierName: string;
  purchaseDate: string;
  paymentDate: string;
  totalAmount: number;
  status: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case '発注待ち':
      return 'warning';
    case '発注済み':
      return 'info';
    case '入荷済み':
      return 'success';
    case 'キャンセル':
      return 'error';
    default:
      return 'default';
  }
};

const tableColumns: Column<Purchase>[] = [
  { field: 'purchaseNumber', headerName: '仕入番号', width: 150 },
  { field: 'supplierName', headerName: '仕入先', width: 200 },
  { field: 'purchaseDate', headerName: '仕入日', width: 120 },
  { field: 'paymentDate', headerName: '支払予定日', width: 120 },
  { 
    field: 'totalAmount', 
    headerName: '仕入金額', 
    width: 120,
    align: 'right',
    valueGetter: ({ row }) => `¥${row.totalAmount.toLocaleString()}`
  },
  { 
    field: 'status', 
    headerName: 'ステータス', 
    width: 120,
    renderCell: ({ row }) => (
      <Chip
        label={row.status}
        color={getStatusColor(row.status)}
        size="small"
      />
    )
  },
];

// ダミーデータ
const dummyPurchases: Purchase[] = [
  {
    id: "1",
    purchaseNumber: 'PUR-2024-001',
    supplierName: '山田建材株式会社',
    purchaseDate: '2024-01-15',
    paymentDate: '2024-02-15',
    totalAmount: 1500000,
    status: '入荷済み'
  },
  {
    id: "2",
    purchaseNumber: 'PUR-2024-002',
    supplierName: '鈴木工業株式会社',
    purchaseDate: '2024-02-01',
    paymentDate: '2024-03-01',
    totalAmount: 2800000,
    status: '発注待ち'
  },
  {
    id: "3",
    purchaseNumber: 'PUR-2024-003',
    supplierName: '佐藤商事株式会社',
    purchaseDate: '2024-02-10',
    paymentDate: '2024-03-10',
    totalAmount: 950000,
    status: '発注済み'
  }
];

export default function PurchaseListPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: purchaseToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<Purchase>({
    onSuccess: (deletedPurchase) => {
      setPurchases(purchases.filter(p => p.id !== deletedPurchase.id));
    },
  });

  useEffect(() => {
    // ダミーデータを使用するため、APIコールは一時的にコメントアウト
    // const fetchPurchases = async () => {
    //   try {
    //     const response = await fetch('/api/purchases');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setPurchases(data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching purchases:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPurchases();

    // ダミーデータを使用
    setTimeout(() => {
      setPurchases(dummyPurchases);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = async (purchase: Purchase) => {
    handleDeleteClick(purchase);
  };

  if (loading) {
    return (
      <ListPageLayout title="仕入一覧">
        <LoadingSpinner />
      </ListPageLayout>
    );
  }

  return (
    <ListPageLayout
      title="仕入一覧"
      addButtonLabel="仕入登録"
      onAddClick={() => router.push('/purchases/new')}
    >
      <DataTable<Purchase>
        columns={tableColumns}
        rows={purchases}
        loading={loading}
        getRowId={(row) => row.id}
        actions={[
          {
            icon: <EditIcon />,
            tooltip: '編集',
            onClick: (purchase) => router.push(`/purchases/${purchase.id}/edit`),
            show: (purchase) => ['仕入待ち'].includes(purchase.status)
          },
          {
            icon: <DeleteIcon />,
            tooltip: '削除',
            onClick: handleDelete,
            show: (purchase) => purchase.status === '仕入待ち',
            color: 'error'
          }
        ]}
      />
    </ListPageLayout>
  );
} 