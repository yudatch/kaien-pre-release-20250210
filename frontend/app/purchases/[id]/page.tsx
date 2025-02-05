"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/api/client';
import { purchasesApi } from '@/app/api/purchases';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit,
  LocalShipping,
  Check,
  Close
} from '@mui/icons-material';
import { PurchaseOrder } from '@/app/types/purchase';
import Link from 'next/link';

// ステータス表示用の設定
const statusConfig = {
  draft: { label: '下書き', color: 'default' },
  pending: { label: '発注待ち', color: 'warning' },
  ordered: { label: '発注済', color: 'info' },
  received: { label: '入荷済', color: 'success' },
  cancelled: { label: 'キャンセル', color: 'error' }
} as const;

const approvalStatusConfig = {
  pending: { label: '承認待ち', color: 'warning' },
  approved: { label: '承認済', color: 'success' },
  rejected: { label: '却下', color: 'error' }
} as const;

export default function PurchaseOrderDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await purchasesApi.getOrder(params.id);
        setOrder(response.data);
      } catch (error) {
        console.error('発注データの取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleApproval = async (status: 'approved' | 'rejected') => {
    setSubmitting(true);
    try {
      await purchasesApi.approveOrder(params.id, {
        status,
        notes: approvalNotes
      });
      // 更新後のデータを再取得
      const response = await purchasesApi.getOrder(params.id);
      setOrder(response.data);
      setApprovalDialog(false);
    } catch (error) {
      console.error('承認処理に失敗:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return <Typography>発注データが見つかりません</Typography>;
  }

  return (
    <Box>
      {/* ヘッダー部分 */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary' }}>
        <Typography variant="h5">発注詳細: {order.order_number}</Typography>
        <Stack direction="row" spacing={2}>
          {order.status === 'ordered' && (
            <Button
              startIcon={<LocalShipping />}
              variant="outlined"
              onClick={() => router.push(`/purchases/${order.order_id}/receive`)}
            >
              入荷登録
            </Button>
          )}
          <Button
            startIcon={<Edit />}
            variant="outlined"
            onClick={() => router.push(`/purchases/${order.order_id}/edit`)}
          >
            編集
          </Button>
        </Stack>
      </Box>

      {/* 基本情報 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">発注番号</Typography>
                <Link 
                  href={`/purchases/${order.order_id}`}
                  style={{ 
                    color: 'primary.main', 
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <Typography>{order.order_number}</Typography>
                </Link>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">仕入先</Typography>
                <Typography>{order.Supplier.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ステータス</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={statusConfig[order.status].label}
                    color={statusConfig[order.status].color as any}
                    size="small"
                  />
                </Box>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">発注日</Typography>
                <Typography>{new Date(order.order_date).toLocaleDateString('ja-JP')}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">納期</Typography>
                <Typography>{new Date(order.delivery_date).toLocaleDateString('ja-JP')}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">承認状態</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={approvalStatusConfig[order.approval_status].label}
                    color={approvalStatusConfig[order.approval_status].color as any}
                    size="small"
                  />
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* 発注明細 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>発注明細</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>商品コード</TableCell>
                <TableCell>商品名</TableCell>
                <TableCell align="right">数量</TableCell>
                <TableCell align="right">単価</TableCell>
                <TableCell align="right">金額</TableCell>
                <TableCell>納品状態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.PurchaseOrderDetails.map((detail) => (
                <TableRow key={detail.detail_id}>
                  <TableCell>{detail.Product.product_code}</TableCell>
                  <TableCell>{detail.Product.name}</TableCell>
                  <TableCell align="right">{detail.quantity}</TableCell>
                  <TableCell align="right">¥{detail.unit_price.toLocaleString()}</TableCell>
                  <TableCell align="right">¥{detail.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        detail.delivery_status === 'received' ? '入荷済' :
                        detail.delivery_status === 'partial' ? '一部入荷' : '未入荷'
                      }
                      color={
                        detail.delivery_status === 'received' ? 'success' :
                        detail.delivery_status === 'partial' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 合計金額 */}
        <Box sx={{ m: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Stack spacing={1} sx={{ width: '200px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography>小計</Typography>
              <Typography>¥{order.subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography>消費税</Typography>
              <Typography>¥{order.tax_amount.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'text.secondary' }}>
              <Typography>合計</Typography>
              <Typography>¥{order.total_amount.toLocaleString()}</Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* 承認ダイアログ */}
      <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)}>
        <DialogTitle>発注承認</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="承認コメント"
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setApprovalDialog(false)}
            disabled={submitting}
          >
            キャンセル
          </Button>
          <Button
            onClick={() => handleApproval('rejected')}
            color="error"
            disabled={submitting}
            startIcon={<Close />}
          >
            却下
          </Button>
          <Button
            onClick={() => handleApproval('approved')}
            color="primary"
            disabled={submitting}
            startIcon={<Check />}
          >
            承認
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 