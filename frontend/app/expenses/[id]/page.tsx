"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Grid, Paper, Typography, Modal, Fade, Backdrop } from '@mui/material';
import { Edit as EditIcon, ArrowBack, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { expensesApi } from '@/app/api/expenses';
import { Expense, ExpenseResponse, RejectExpenseRequest } from '@/app/types/api/expenses';
import { ExpenseCategory, PaymentMethod } from '@/app/types/common';
import { formatCurrency } from '@/app/utils/currency';
import ExpenseForm from '@/app/components/features/expenses/ExpenseForm';
import { useAuth } from '@/app/contexts/AuthContext';
import dayjs from 'dayjs';
import { EXPENSE_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '@/app/constants/expenses';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams ? searchParams.get('mode') : null;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const expenseId = params?.id ? parseInt(params.id as string) : null;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { hasApprovalAccess } = useAuth();

  useEffect(() => {
    if (!expenseId) return;

    const fetchExpense = async () => {
      try {
        const response = await expensesApi.getExpense(expenseId);
        if (response.data && typeof response.data === 'object' && 'expense_id' in response.data) {
          setExpense(response.data as unknown as Expense);
        }
      } catch (error) {
        console.error('Error fetching expense:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      if (!expenseId) {
        throw new Error('経費IDが見つかりません');
      }

      console.log('フォームデータ:', formData);

      const requestData = {
        id: expenseId,
        expense_date: formData.expense_date,
        category: formData.category,
        amount: Math.floor(Number(formData.amount)),
        payment_method: formData.payment_method || formData.paymentMethod,
        description: formData.description || '',
        purpose: formData.purpose || '',
        receipt_image: formData.receipt_image instanceof File ? formData.receipt_image : null,
        receipt_image_url: formData.receipt_image ? formData.receipt_image_url : 'null'
      };

      console.log('APIリクエストデータ:', requestData);

      await expensesApi.updateExpense(requestData);
      router.push('/expenses/list');
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('経費の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleApprove = async () => {
    try {
      if (!expenseId) return;
      await expensesApi.approveExpense({ id: expenseId });
      setMessage({ type: 'success', text: '経費を承認しました。' });
      // 3秒後に一覧画面に戻る
      setTimeout(() => {
        router.push('/expenses/approval/list');
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '経費の承認に失敗しました。' });
    }
  };

  const handleReject = async () => {
    try {
      if (!expenseId) return;
      const rejectRequest: RejectExpenseRequest = {
        id: expenseId,
        reason: '否認理由をここに入力' // TODO: 否認理由入力ダイアログの実装
      };
      await expensesApi.rejectExpense(rejectRequest);
      setMessage({ type: 'success', text: '経費を否認しました。' });
      // 3秒後に一覧画面に戻る
      setTimeout(() => {
        router.push('/expenses/approval/list');
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '経費の否認に失敗しました。' });
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
        <Typography color="error">経費データが見つかりませんでした。</Typography>
      </Box>
    );
  }

  if (mode === 'edit') {
    const initialData = {
      date: expense.expense_date ? dayjs(expense.expense_date) : null,
      category: expense.category as ExpenseCategory,
      amount: String(Math.floor(Number(expense.amount))),
      paymentMethod: expense.payment_method as PaymentMethod,
      description: expense.description,
      purpose: expense.purpose,
      receiptImage: null,
      receipt_image_url: expense.receipt_image_url
    };

    return (
      <Box className="p-6">
        <Box sx={{ mb: 3 }}>
          <PageTitle title="経費編集" />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/expenses/list')}
              sx={{ minWidth: 110 }}
            >
              一覧へ戻る
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push(`/expenses/${expenseId}`)}
              sx={{ minWidth: 110 }}
            >
              詳細へ戻る
            </Button>
          </Box>
        </Box>

        <ExpenseForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/expenses/${expenseId}`)}
        />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="経費詳細" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push(hasApprovalAccess() ? '/expenses/approval/list' : '/expenses/list')}
            sx={{ minWidth: 110 }}
          >
            一覧へ戻る
          </Button>
          {!hasApprovalAccess() && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/expenses/${expenseId}?mode=edit`)}
              sx={{ minWidth: 110 }}
            >
              編集
            </Button>
          )}
          {hasApprovalAccess() && expense?.status === '申請中' && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckIcon />}
                onClick={handleApprove}
                sx={{ minWidth: 110 }}
              >
                承認
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CloseIcon />}
                onClick={handleReject}
                sx={{ minWidth: 110 }}
              >
                否認
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {message && (
        <Box sx={{ mb: 2 }}>
          <FeedbackMessage
            type={message.type}
            message={message.text}
          />
        </Box>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">経費番号</Typography>
            <Typography>{expense.expense_number}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">ステータス</Typography>
            <Typography>{expense.status}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">申請日</Typography>
            <Typography>{expense.expense_date}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">経費区分</Typography>
            <Typography>{EXPENSE_CATEGORY_LABELS[expense.category]}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">金額</Typography>
            <Typography>{formatCurrency(expense.amount)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">支払方法</Typography>
            <Typography>{PAYMENT_METHOD_LABELS[expense.payment_method]}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">用途</Typography>
            <Typography>{expense.purpose}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">説明</Typography>
            <Typography>{expense.description}</Typography>
          </Grid>
          {expense.receipt_image_url && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">領収書</Typography>
              <Box 
                sx={{ 
                  mt: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                onClick={handleImageClick}
              >
                <img
                  src={`${API_BASE_URL}${expense.receipt_image_url}`}
                  alt="領収書"
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* 画像拡大表示用モーダル */}
      <Modal
        open={isImageModalOpen}
        onClose={handleCloseImageModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isImageModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              outline: 'none',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            {expense.receipt_image_url && (
              <img
                src={`${API_BASE_URL}${expense.receipt_image_url}`}
                alt="領収書"
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                }}
              />
            )}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={handleCloseImageModal} variant="contained">
                閉じる
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
} 