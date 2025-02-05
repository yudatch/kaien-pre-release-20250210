"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/api/client';
import { purchasesApi } from '@/app/api/purchases';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';
import { PurchaseOrder } from '@/app/types/purchase';
import { ReceiveItem } from '@/app/types/pages/purchases';

export default function ReceivePurchaseOrder({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await purchasesApi.getOrder(params.id);
        setOrder(response.data);
        
        // 入荷データの初期化
        const items = response.data.PurchaseOrderDetails.map(detail => ({
          detail_id: detail.detail_id,
          product_id: detail.product_id,
          product_name: detail.Product.name,
          ordered_quantity: detail.quantity,
          received_quantity: detail.received_quantity || 0,
          remaining_quantity: detail.quantity - (detail.received_quantity || 0),
          new_received_quantity: 0,
          delivery_status: detail.delivery_status
        }));
        setReceiveItems(items);
      } catch (error) {
        console.error('発注データの取得に失敗:', error);
        setSnackbar({
          open: true,
          message: 'データの取得に失敗しました',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleQuantityChange = (index: number, value: number) => {
    const newItems = [...receiveItems];
    newItems[index].new_received_quantity = Math.min(
      Math.max(0, value), // 0以上
      newItems[index].remaining_quantity // 残数量以下
    );
    setReceiveItems(newItems);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const updatePromises = receiveItems
        .filter(item => item.new_received_quantity > 0)
        .map(item => {
          return purchasesApi.updateDelivery(item.detail_id, {
            received_quantity: item.new_received_quantity
          });
        });

      await Promise.all(updatePromises);
      router.push(`/purchases/${params.id}`);
    } catch (error) {
      console.error('入荷登録エラー:', error);
      setSnackbar({
        open: true,
        message: '入荷登録に失敗しました',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1">
          入荷登録: {order.order_number}
        </Typography>
      </Box>

      {/* 発注基本情報 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">仕入先</Typography>
              <Typography>{order.Supplier.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">発注日</Typography>
              <Typography>{new Date(order.order_date).toLocaleDateString('ja-JP')}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 入荷登録テーブル */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>商品名</TableCell>
                <TableCell align="right">発注数</TableCell>
                <TableCell align="right">入荷済数</TableCell>
                <TableCell align="right">残数</TableCell>
                <TableCell align="right">今回入荷数</TableCell>
                <TableCell>状態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receiveItems.map((item, index) => (
                <TableRow key={item.detail_id}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell align="right">{item.ordered_quantity}</TableCell>
                  <TableCell align="right">{item.received_quantity}</TableCell>
                  <TableCell align="right">{item.remaining_quantity}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={item.new_received_quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                      inputProps={{
                        min: 0,
                        max: item.remaining_quantity
                      }}
                      disabled={item.delivery_status === 'received'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        item.delivery_status === 'received' ? '入荷済' :
                        item.delivery_status === 'partial' ? '一部入荷' : '未入荷'
                      }
                      color={
                        item.delivery_status === 'received' ? 'success' :
                        item.delivery_status === 'partial' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* アクションボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          disabled={submitting}
        >
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !receiveItems.some(item => item.new_received_quantity > 0)}
        >
          {submitting ? <CircularProgress size={24} /> : '入荷登録'}
        </Button>
      </Box>

      {/* スナックバー */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 