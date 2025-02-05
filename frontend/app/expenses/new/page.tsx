"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { expensesApi } from '@/app/api/expenses';
import ExpenseForm from '@/app/components/features/expenses/ExpenseForm';
import { ExpenseFormData } from '@/app/types/components/features/expenses/forms';
import dayjs from 'dayjs';

export default function ExpenseNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      await expensesApi.createExpense({
        expense_date: formData.expense_date ? dayjs(formData.expense_date).add(9, 'hour').format('YYYY-MM-DD') : '',
        category: formData.category,
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        description: formData.description || '',
        purpose: formData.purpose,
        receipt_image: formData.receipt_image
      });
      router.push('/expenses/list');
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('経費の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="経費申請" />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/expenses/list')}
          >
            一覧へ戻る
          </Button>
        </Box>
      </Box>

      <ExpenseForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/expenses/list')}
      />
    </Box>
  );
} 