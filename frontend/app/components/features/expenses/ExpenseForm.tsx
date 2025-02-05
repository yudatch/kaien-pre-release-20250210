"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  SelectChangeEvent,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ExpenseFormData, ExpenseFormProps, UploadProgressEvent, ExpenseApiData } from '@/app/types/components/features/expenses/forms';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/app/constants/expenses';
import { ExpenseCategory, PaymentMethod } from '@/app/types/common';
import dayjs from 'dayjs';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ExpenseForm({
  mode = 'create',
  initialData,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  console.log('=== ExpenseForm初期化 ===');
  console.log('initialData:', initialData);
  console.log('initialData.expense_date:', initialData?.expense_date);

  const [formData, setFormData] = useState<ExpenseFormData>(() => {
    console.log('=== formData初期化 ===');
    const initial = {
      expense_date: null,
      receipt_date: null,
      invoice_number: '',
      category: '' as ExpenseCategory,
      amount: '',
      payment_method: 'cash' as PaymentMethod,
      description: '',
      purpose: '',
      receipt_image: null,
    };

    if (initialData) {
      console.log('initialDataあり、マージします');
      
      // 日付データの変換
      let expenseDate = null;
      let receiptDate = null;
      if (initialData.expense_date) {
        expenseDate = dayjs(initialData.expense_date);
      } else if (initialData.date) {  // 後方互換性のためdateプロパティもチェック
        expenseDate = dayjs(initialData.date);
      }
      if (initialData.receipt_date) {
        receiptDate = dayjs(initialData.receipt_date);
      } else {
        receiptDate = expenseDate; // デフォルトで経費発生日と同じ
      }
      
      console.log('変換前の日付データ:', {
        expense_date: initialData.expense_date || initialData.date,
        receipt_date: initialData.receipt_date
      });
      console.log('変換後の日付データ:', {
        expense_date: expenseDate,
        receipt_date: receiptDate
      });

      // プロパティ名の正規化
      const normalizedData = {
        ...initialData,
        expense_date: expenseDate,
        receipt_date: receiptDate,
        payment_method: initialData.payment_method || initialData.paymentMethod,
      };

      console.log('正規化後のデータ:', normalizedData);

      return {
        ...initial,
        ...normalizedData,
      };
    }

    console.log('initialDataなし、デフォルト値を使用');
    return initial;
  });

  console.log('=== 初期化後のformData ===');
  console.log('formData:', formData);
  console.log('formData.expense_date:', formData.expense_date);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初期データに画像が含まれている場合のプレビュー処理
  useEffect(() => {
    if (initialData?.receipt_image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(initialData.receipt_image);
    } else if (initialData?.receipt_image_url) {
      setPreviewUrl(`${API_BASE_URL}${initialData.receipt_image_url}`);
    }
  }, [initialData?.receipt_image, initialData?.receipt_image_url]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    // バリデーション
    if (!formData.expense_date) {
      setError('経費発生日を入力してください');
      setIsUploading(false);
      return;
    }
    if (!formData.receipt_date) {
      setError('領収書発行日を入力してください');
      setIsUploading(false);
      return;
    }
    if (!formData.category) {
      setError('経費区分を選択してください');
      setIsUploading(false);
      return;
    }
    if (!formData.amount) {
      setError('金額を入力してください');
      setIsUploading(false);
      return;
    }
    if (!formData.payment_method) {
      setError('支払方法を選択してください');
      setIsUploading(false);
      return;
    }
    if (!formData.purpose) {
      setError('用途を入力してください');
      setIsUploading(false);
      return;
    }

    // 領収書発行日が経費発生日より後の場合はエラー
    if (formData.receipt_date && formData.expense_date && formData.receipt_date.isAfter(formData.expense_date)) {
      setError('領収書発行日は経費発生日以前である必要があります');
      setIsUploading(false);
      return;
    }

    // APIに送信するデータを構築
    const apiData: ExpenseApiData = {
      id: initialData?.expense_id,
      expense_date: formData.expense_date ? dayjs(formData.expense_date).add(9, 'hour').format('YYYY-MM-DD') : '',
      receipt_date: formData.receipt_date ? dayjs(formData.receipt_date).add(9, 'hour').format('YYYY-MM-DD') : '',
      invoice_number: formData.invoice_number,
      category: formData.category,
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      description: formData.description || '',
      purpose: formData.purpose,
      receipt_image: formData.receipt_image,
      receipt_image_url: formData.receipt_image ? formData.receipt_image_url : 'null'
    };

    console.log('\n=== フォーム送信データ ===');
    console.log('formData:', apiData);

    try {
      if (onSubmit) {
        await onSubmit(apiData, {
          onUploadProgress: (progressEvent: UploadProgressEvent) => {
            const total = progressEvent.total ?? 0;
            if (total > 0) {
              const progress = Math.round((progressEvent.loaded * 100) / total);
              setUploadProgress(progress);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('アップロードに失敗しました。再試行してください。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    // ファイルサイズチェック
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください');
      return;
    }

    // MIME typeチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('JPG、PNG、GIF形式の画像のみアップロード可能です');
      return;
    }

    // 画像の解像度チェック
    const img = new Image();
    img.onload = () => {
      const maxDimension = 4096; // 最大解像度
      if (img.width > maxDimension || img.height > maxDimension) {
        setError(`画像の解像度が大きすぎます。${maxDimension}x${maxDimension}以下にしてください`);
        return;
      }

      // プレビューURLを生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({
        ...prev,
        receipt_image: file,
        receipt_image_url: undefined  // 新しいファイルがアップロードされたら、既存のURLをクリア
      }));
      setError(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleRemoveImage = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData(prev => ({
      ...prev,
      receipt_image: null,
      receipt_image_url: undefined
    }));
  }, []);

  const isReadOnly = mode === 'view';

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="経費発生日"
              value={formData.expense_date}
              onChange={(newValue) => {
                setFormData(prev => ({
                  ...prev,
                  expense_date: newValue,
                  // 領収書発行日が未設定の場合は経費発生日と同じ日付を設定
                  receipt_date: prev.receipt_date || newValue
                }));
              }}
              disabled={isReadOnly}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!error && !formData.expense_date
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="領収書発行日"
              value={formData.receipt_date}
              onChange={(newValue) => {
                setFormData(prev => ({
                  ...prev,
                  receipt_date: newValue
                }));
              }}
              disabled={isReadOnly}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!error && !formData.receipt_date
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="invoice_number"
              label="インボイス番号"
              value={formData.invoice_number || ''}
              onChange={handleChange}
              fullWidth
              disabled={isReadOnly}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>経費区分</InputLabel>
              <Select<ExpenseCategory>
                name="category"
                value={formData.category}
                onChange={handleChange as (event: SelectChangeEvent<ExpenseCategory>) => void}
                label="経費区分"
                disabled={isReadOnly}
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="amount"
              label="金額"
              value={formData.amount}
              onChange={handleChange}
              type="number"
              required
              disabled={isReadOnly}
              InputProps={{
                startAdornment: <InputAdornment position="start">¥</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>支払方法</InputLabel>
              <Select<PaymentMethod>
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange as (event: SelectChangeEvent<PaymentMethod>) => void}
                label="支払方法"
                disabled={isReadOnly}
              >
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="purpose"
              label="用途"
              value={formData.purpose}
              onChange={handleChange}
              required
              disabled={isReadOnly}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="説明"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={isReadOnly}
            />
          </Grid>

          <Grid item xs={12}>
            {!isReadOnly ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: `2px dashed ${isDragging ? '#2196f3' : '#ccc'}`,
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: isDragging ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('receipt-image-input')?.click()}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="receipt-image-input"
                  />
                  <CloudUploadIcon sx={{ fontSize: 48, color: isDragging ? '#2196f3' : '#999' }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    領収書をドラッグ＆ドロップまたはクリックしてアップロード
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formData.receipt_image ? formData.receipt_image.name : 'JPG、PNG、GIF形式（5MB以下）'}
                  </Typography>

                  {isUploading && (
                    <Box sx={{ mt: 2, width: '100%' }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                      <Typography variant="caption" color="textSecondary">
                        アップロード中... {uploadProgress}%
                      </Typography>
                    </Box>
                  )}

                  {previewUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={previewUrl}
                        alt="領収書プレビュー"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          objectFit: 'contain',
                          border: '1px solid #eee',
                          borderRadius: '4px',
                        }}
                      />
                      {!isReadOnly && (
                        <Button
                          size="small"
                          color="error"
                          onClick={handleRemoveImage}
                          sx={{ mt: 1 }}
                        >
                          削除
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
                {error && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {error}
                  </Typography>
                )}
              </Grid>
            ) : (
              previewUrl && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={previewUrl}
                      alt="領収書プレビュー"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                      }}
                    />
                  </Box>
                </Grid>
              )
            )}
          </Grid>

          {!isReadOnly && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel}>
                    キャンセル
                  </Button>
                )}
                <Button type="submit" variant="contained" color="primary">
                  {mode === 'create' ? '申請' : '更新'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
} 