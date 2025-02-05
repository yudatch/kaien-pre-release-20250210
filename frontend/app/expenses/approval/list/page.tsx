"use client";

import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { DataTable } from '@/app/components/core/display/DataTable';
import { expensesApi } from '@/app/api/expenses';
import { Expense } from '@/app/types/api/expenses';
import { Column } from '@/app/types/components/core/table';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import { EXPENSE_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '@/app/constants/expenses';
import { formatCurrency } from '@/app/utils/currency';
import { formatDate } from '@/app/utils/date';

export default function ExpenseApprovalListPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tableColumns: Column<Expense>[] = [
    {
      field: 'expense_number',
      headerName: '経費番号',
      width: 150,
      valueGetter: ({ row }) => row.expense_number,
    },
    {
      field: 'expense_date',
      headerName: '日付',
      width: 120,
      valueGetter: ({ row }) => formatDate(row.expense_date),
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
    }
  ];

  useEffect(() => {
    console.log('ExpenseApprovalListPage mounted');
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    console.log('Fetching expenses...');
    try {
      const response = await expensesApi.getPendingExpenses();
      console.log('API Response:', response);
      if ('expenses' in response.data) {
        setExpenses(response.data.expenses);
      } else {
        setMessage({ type: 'error', text: '経費データの取得に失敗しました。' });
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setMessage({ type: 'error', text: '経費データの取得に失敗しました。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ListPageLayout title="承認待ち一覧">
      <Box sx={{ height: 600, width: '100%' }}>
        {message && (
          <FeedbackMessage
            type={message.type}
            message={message.text}
          />
        )}
        <DataTable<Expense>
          rows={expenses}
          columns={tableColumns}
          loading={loading}
          getRowId={(row) => row.expense_id}
          actions={[
            {
              label: '承認業務',
              onClick: (expense) => router.push(`/expenses/${expense.expense_id}`),
              color: 'primary',
              variant: 'contained'
            }
          ]}
        />
      </Box>
    </ListPageLayout>
  );
} 