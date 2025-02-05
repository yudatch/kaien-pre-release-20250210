"use client";

import { useState } from 'react';
import {
  Box,
  Chip,
} from '@mui/material';
import { ProjectPaymentListItem } from '@/app/types/components/features/projects/payment';
import { DataTable } from '@/app/components/core/display/DataTable';
import { Column } from '@/app/types/components/core/table';

// ダミーデータ
const dummyPayments: ProjectPaymentListItem[] = [
  {
    id: '1',
    projectId: 'PRJ-001',
    projectName: '本社ビル改装工事',
    customerName: '株式会社山田建設',
    invoiceNumber: 'INV-2024-001',
    paymentDate: '2024-01-15',
    amount: 5000000,
    method: '銀行振込',
    status: '入金済'
  },
  {
    id: '2',
    projectId: 'PRJ-002',
    projectName: '新工場建設プロジェクト',
    customerName: '鈴木工業株式会社',
    invoiceNumber: 'INV-2024-002',
    paymentDate: '2024-01-20',
    amount: 6000000,
    method: '銀行振込',
    status: '一部入金'
  },
  {
    id: '3',
    projectId: 'PRJ-003',
    projectName: '店舗内装工事',
    customerName: '佐藤商事株式会社',
    invoiceNumber: 'INV-2024-003',
    paymentDate: '',
    amount: 3000000,
    method: '',
    status: '未入金'
  }
];

const statusConfig = {
  '未入金': { label: '未入金', color: 'error' },
  '一部入金': { label: '一部入金', color: 'warning' },
  '入金済': { label: '入金済', color: 'success' }
} as const;

const tableColumns: Column<ProjectPaymentListItem>[] = [
  { 
    field: 'invoiceNumber', 
    headerName: '請求番号',
    width: 150
  },
  { field: 'projectName', headerName: '案件名', width: 200 },
  { field: 'customerName', headerName: '顧客名', width: 150 },
  { 
    field: 'paymentDate', 
    headerName: '入金日', 
    width: 120,
    valueGetter: ({ row }) => row.paymentDate || '-'
  },
  { 
    field: 'amount',
    headerName: '金額',
    width: 120,
    align: 'right',
    valueGetter: ({ row }) => `¥${row.amount.toLocaleString()}`
  },
  { field: 'method', headerName: '入金方法', width: 120 },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 100,
    renderCell: ({ row }) => (
      <Chip
        label={statusConfig[row.status as keyof typeof statusConfig]?.label || row.status}
        color={statusConfig[row.status as keyof typeof statusConfig]?.color || 'default'}
        size="small"
      />
    )
  }
];

export default function PaymentList() {
  const [payments, setPayments] = useState<ProjectPaymentListItem[]>(dummyPayments);
  const [loading, setLoading] = useState(false);

  return (
    <Box>
      <DataTable<ProjectPaymentListItem>
        columns={tableColumns}
        rows={payments}
        loading={loading}
      />
    </Box>
  );
} 