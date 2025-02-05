"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { expensesApi } from '@/app/api/expenses';
import { Expense } from '@/app/types/api/expenses';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import { DataTable } from '@/app/components/core/display/DataTable';
import { DeleteConfirmDialog } from '@/app/components/core/feedback/DeleteConfirmDialog';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { useDelete } from '@/app/hooks/useDelete';
import { tableColumns } from './tableConfig';

export default function ExpenseListPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: expenseToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<Expense>({
    onDelete: (id: number) => expensesApi.deleteExpense(id),
    onSuccess: (deletedExpense) => {
      setExpenses(expenses.filter(e => e.expense_id !== deletedExpense.expense_id));
      setSuccessMessage('経費を削除しました。');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await expensesApi.getExpenses();
        if ('expenses' in response.data) {
          setExpenses(response.data.expenses);
        } else {
          setError('経費データの取得に失敗しました。');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError(error instanceof Error ? error.message : '経費データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (expense: Expense) => {
    if (expense.status === '承認済') {
      setError('承認済の経費は削除できません');
      setTimeout(() => setError(null), 3000);
      return;
    }
    handleDeleteClick(expense);
  };

  const executeDelete = async () => {
    if (!expenseToDelete) return;
    await handleDeleteConfirm();
  };

  const tableActions = [
    {
      icon: <EditIcon />,
      tooltip: '編集',
      onClick: (expense: Expense) => router.push(`/expenses/${expense.expense_id}?mode=edit`),
      show: (expense: Expense) => expense.status === 'draft' || expense.status === '否認',
      color: 'primary' as const,
    },
    {
      icon: <DeleteIcon />,
      tooltip: '削除',
      onClick: handleDelete,
      show: (expense: Expense) => expense.status === 'draft',
      color: 'error' as const,
    }
  ].filter(action => action !== null);

  if (loading) {
    return (
      <ListPageLayout title="経費一覧">
        <LoadingSpinner />
      </ListPageLayout>
    );
  }

  return (
    <ListPageLayout
      title="経費一覧"
      addButtonLabel="経費申請"
      onAddClick={() => router.push('/expenses/new')}
      customLayout={{
        useButtonGroup: true,
        buttonGroupStyle: {
          borderColor: '#e0e0e0',
          color: '#666666',
          hoverBorderColor: '#3b82f6',
          hoverBackgroundColor: 'rgba(59, 130, 246, 0.04)'
        },
        additionalButtons: []
      }}
    >
      {(error || deleteError) && (
        <FeedbackMessage message={error || deleteError} type="error" />
      )}
      {successMessage && (
        <FeedbackMessage message={successMessage} type="success" />
      )}

      <DataTable<Expense>
        columns={tableColumns}
        rows={expenses}
        loading={loading}
        getRowId={(row) => row.expense_id}
        actions={tableActions}
        useButtonGroup={true}
        customTableStyle={{
          elevation: 0,
          border: '1px solid #e0e0e0',
          borderRadius: 2
        }}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="経費の削除"
        targetName={expenseToDelete?.expense_number}
        onCancel={handleDeleteCancel}
        onConfirm={executeDelete}
        isLoading={isDeleting}
      />
    </ListPageLayout>
  );
} 