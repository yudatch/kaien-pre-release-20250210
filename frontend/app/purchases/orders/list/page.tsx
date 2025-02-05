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

type Order = {
  id: number;
  orderNumber: string;
  supplierName: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case '作成中':
      return 'default';
    case '発注済':
      return 'warning';
    case '納品済':
      return 'success';
    case '遅延':
      return 'error';
    default:
      return 'default';
  }
};

const tableColumns: Column<Order>[] = [
  { field: 'orderNumber', headerName: '発注番号', width: 150 },
  { field: 'supplierName', headerName: '仕入先', width: 200 },
  { field: 'orderDate', headerName: '発注日', width: 120 },
  { field: 'deliveryDate', headerName: '納品予定日', width: 120 },
  { 
    field: 'totalAmount', 
    headerName: '発注金額', 
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
const dummyOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'PO-2024-001',
    supplierName: '山田建材株式会社',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-30',
    totalAmount: 1500000,
    status: '納品済'
  },
  {
    id: 2,
    orderNumber: 'PO-2024-002',
    supplierName: '鈴木工業株式会社',
    orderDate: '2024-02-01',
    deliveryDate: '2024-02-15',
    totalAmount: 2800000,
    status: '発注済'
  },
  {
    id: 3,
    orderNumber: 'PO-2024-003',
    supplierName: '佐藤商事株式会社',
    orderDate: '2024-02-10',
    deliveryDate: '2024-02-25',
    totalAmount: 950000,
    status: '作成中'
  }
];

export default function OrderListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: orderToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<Order>({
    onSuccess: (deletedOrder) => {
      setOrders(orders.filter(o => o.id !== deletedOrder.id));
    },
  });

  useEffect(() => {
    // ダミーデータを使用するため、APIコールは一時的にコメントアウト
    // const fetchOrders = async () => {
    //   try {
    //     const response = await fetch('/api/purchases/orders');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setOrders(data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching orders:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchOrders();

    // ダミーデータを使用
    setTimeout(() => {
      setOrders(dummyOrders);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = async (order: Order) => {
    handleDeleteClick(order);
  };

  if (loading) {
    return (
      <ListPageLayout title="発注一覧">
        <LoadingSpinner />
      </ListPageLayout>
    );
  }

  return (
    <ListPageLayout
      title="発注一覧"
      addButtonLabel="発注登録"
      onAddClick={() => router.push('/purchases/orders/new')}
    >
      <DataTable<Order>
        columns={tableColumns}
        rows={orders}
        loading={loading}
        getRowId={(row) => row.id}
        actions={[
          {
            icon: <EditIcon />,
            tooltip: '編集',
            onClick: (order) => router.push(`/purchases/orders/${order.id}/edit`),
            show: (order) => order.status === '作成中'
          },
          {
            icon: <DeleteIcon />,
            tooltip: '削除',
            onClick: handleDelete,
            show: (order) => order.status === '作成中',
            color: 'error'
          }
        ]}
      />
    </ListPageLayout>
  );
} 