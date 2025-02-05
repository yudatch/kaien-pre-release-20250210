"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { expensesApi } from '@/app/api/expenses';
import { Expense, ExpenseResponse } from '@/app/types/api/expenses';
import ExpenseForm from '@/app/components/features/expenses/ExpenseForm';
import { ExpenseCategory, PaymentMethod } from '@/app/types/common';
import dayjs from 'dayjs';

export default function ExpenseEditPage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const expenseId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (!expenseId) return;

    const fetchExpense = async () => {
      console.log('=== fetchExpense開始 ===');
      console.log('expenseId:', expenseId);
      
      try {
        const response = await expensesApi.getExpense(expenseId);
        console.log('APIレスポンス:', response);
        
        const expenseResponse = response.data as ExpenseResponse;
        console.log('ExpenseResponse:', expenseResponse);
        
        if (expenseResponse.data) {
          console.log('=== APIレスポンスの詳細 ===');
          console.log('APIレスポンス全体:', expenseResponse.data);
          console.log('日付データ（生）:', expenseResponse.data.expense_date);
          console.log('日付データ型:', typeof expenseResponse.data.expense_date);
          
          // 日付データを適切な形式に変換
          const parsedDate = dayjs(expenseResponse.data.expense_date);
          console.log('Dayjs変換後:', parsedDate);
          console.log('Dayjs有効性:', parsedDate.isValid());
          console.log('Dayjs ISO形式:', parsedDate.toISOString());
          
          setExpense(expenseResponse.data);
        } else {
          console.log('expenseResponse.dataが存在しません');
        }
      } catch (error) {
        console.error('Error fetching expense:', error);
        alert('経費データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    console.log('=== useEffect実行 ===');
    fetchExpense();
  }, [expenseId]);

  // ExpenseFormに渡す直前のデータをログ出力
  useEffect(() => {
    if (expense) {
      console.log('=== ExpenseFormに渡すデータ ===');
      console.log('expense:', expense);
      console.log('initialData:', {
        expense_id: expense.expense_id,
        date: dayjs(expense.expense_date),
        category: expense.category,
        amount: expense.amount.toString(),
        paymentMethod: expense.payment_method,
        description: expense.description || '',
        purpose: expense.purpose || '',
        receipt_image_url: expense.receipt_image_url
      });
    }
  }, [expense]);

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!expenseId) {
        throw new Error('経費IDが見つかりません');
      }

      const requestData = {
        id: expenseId,
        expense_date: formData.date ? dayjs(formData.date).format('YYYY-MM-DD') : '',
        category: formData.category,
        amount: Math.floor(Number(formData.amount)),
        payment_method: formData.paymentMethod,
        description: formData.description || '',
        purpose: formData.purpose || '',
        receipt_image: formData.receipt_image instanceof File ? formData.receipt_image : null,
        receipt_image_url: formData.receipt_image ? formData.receipt_image_url : 'null'
      };

      // 即座に遷移を開始
      window.location.replace('/expenses/list');

      // バックグラウンドで更新を実行
      expensesApi.updateExpense(requestData).catch((error) => {
        console.error('Error updating expense:', error);
      });
    } catch (error) {
      console.error('Error preparing update:', error);
      alert('経費の更新に失敗しました');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className="p-6">
        <LoadingSpinner />
      </Box>
    );
  }

  if (!expense) {
    return (
      <Box className="p-6">
        <Typography color="error">経費データが見つかりません</Typography>
      </Box>
    );
  }

  // リダイレクト中は空のコンテンツを表示
  if (isRedirecting) {
    return <Box className="p-6"><LoadingSpinner /></Box>;
  }

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="経費編集" />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/expenses/list')}
            disabled={isSubmitting}
          >
            一覧へ戻る
          </Button>
        </Box>
      </Box>

      {!isRedirecting && (
        <ExpenseForm
          mode="edit"
          initialData={{
            expense_id: expense.expense_id,
            date: dayjs(expense.expense_date),
            category: expense.category as ExpenseCategory,
            amount: expense.amount.toString(),
            paymentMethod: expense.payment_method as PaymentMethod,
            description: expense.description || '',
            purpose: expense.purpose || '',
            receipt_image_url: expense.receipt_image_url
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/expenses/list')}
        />
      )}
    </Box>
  );
} 