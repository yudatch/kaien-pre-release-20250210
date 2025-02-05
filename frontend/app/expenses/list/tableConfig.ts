import { Box, Chip } from '@mui/material';
import Link from 'next/link';
import { Column } from '@/app/types/components/core/table';
import { Expense } from '@/app/types/api/expenses';
import { EXPENSE_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '@/app/constants/expenses';
import { formatCurrency } from '@/app/utils/currency';
import { formatDate } from '@/app/utils/date';

const getStatusColor = (status: Expense['status']) => {
  switch (status) {
    case 'draft':
      return 'default';
    case '申請中':
      return 'warning';
    case '承認済':
      return 'success';
    case '否認':
      return 'error';
    case '精算済':
      return 'info';
    default:
      return 'default';
  }
};

export const tableColumns: Column<Expense>[] = [
  {
    field: 'expense_number',
    headerName: '経費番号',
    width: 150,
    renderCell: ({ row }) => (
      <Link
        href={`/expenses/${row.expense_id}`}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {row.expense_number}
      </Link>
    ),
  },
  {
    field: 'expense_date',
    headerName: '経費発生日',
    width: 120,
    valueGetter: ({ row }) => formatDate(row.expense_date),
  },
  {
    field: 'receipt_date',
    headerName: '領収書発行日',
    width: 120,
    valueGetter: ({ row }) => formatDate(row.receipt_date),
  },
  {
    field: 'category',
    headerName: '経費区分',
    width: 150,
    valueGetter: ({ row }) => EXPENSE_CATEGORY_LABELS[row.category],
  },
  {
    field: 'amount',
    headerName: '金額',
    width: 120,
    valueGetter: ({ row }) => formatCurrency(row.amount),
  },
  {
    field: 'payment_method',
    headerName: '支払方法',
    width: 120,
    valueGetter: ({ row }) => PAYMENT_METHOD_LABELS[row.payment_method],
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
    ),
  }
]; 