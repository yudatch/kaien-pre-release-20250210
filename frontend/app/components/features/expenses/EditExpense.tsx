"use client";

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import ExpenseForm from './ExpenseForm';
import dayjs from 'dayjs';
import { ExpenseFormData } from '@/app/types/components/features/expenses/forms';

type EditExpenseProps = {
  expenseId: string;
};

// ダミーデータ
const DUMMY_EXPENSE: ExpenseFormData = {
  date: dayjs('2024-03-15'),
  category: 'transportation',
  amount: '3500',
  paymentMethod: 'credit_card',
  description: '東京出張の新幹線代',
  receiptImage: null
};

export default function EditExpense({ expenseId }: EditExpenseProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseFormData | null>(null);

  useEffect(() => {
    // 実際のAPIから経費データを取得する処理を実装
    // ここではダミーデータを使用
    const fetchExpense = async () => {
      try {
        // APIリクエストの代わりにダミーデータを設定
        await new Promise(resolve => setTimeout(resolve, 500)); // ローディング表示のための遅延
        setExpenseData(DUMMY_EXPENSE);
        setLoading(false);
      } catch (error) {
        setError('経費データの取得に失敗しました');
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FeedbackMessage message={error} type="error" />;
  }

  if (!expenseData) {
    return <FeedbackMessage message="経費データが見つかりません" type="error" />;
  }

  return (
    <Box>
      <ExpenseForm
        mode="edit"
        initialData={expenseData}
        onLoading={setLoading}
      />
    </Box>
  );
} 