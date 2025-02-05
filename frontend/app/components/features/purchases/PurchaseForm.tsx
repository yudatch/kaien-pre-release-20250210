"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Autocomplete, TextField, SelectChangeEvent, Box } from '@mui/material';
import dayjs from 'dayjs';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import FormLayout from '@/app/components/core/layout/FormLayout';
import { FormActions } from '@/app/components/core/form/FormActions';
import {
  FormTextField,
  FormMoneyField,
  FormDateField,
  FormSelectField,
} from '@/app/components/core/form/FormFields';
import { purchasesApi } from '../../../api/purchases';
import { Supplier, PurchaseFormState, PURCHASE_STATUS_OPTIONS } from '@/app/types/components/features/purchases';
import { ApiResponse } from '@/app/types/api';

interface PurchaseFormProps {
  mode?: 'create' | 'edit';
  type: 'order' | 'purchase';
  initialData?: PurchaseFormState & { id: string };
}

const PURCHASE_RECEIPT_STATUS_OPTIONS = [
  { value: '仕入待ち', label: '仕入待ち' },
  { value: '仕入済み', label: '仕入済み' },
  { value: 'キャンセル', label: 'キャンセル' },
] as const;

export default function PurchaseForm({ mode = 'create', type, initialData }: PurchaseFormProps) {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<PurchaseFormState>(() => {
    if (initialData) {
      return {
        ...initialData,
        date: dayjs(initialData.date)
      };
    }
    return {
      date: dayjs(),
      supplierId: '',
      itemName: '',
      quantity: '',
      unitPrice: '',
      status: '発注待ち',
      notes: '',
    };
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await purchasesApi.getMasterSuppliers();
        if (response.success) {
          setSuppliers(response.data);
          
          if (initialData?.supplierId) {
            const supplier = response.data.find((s: Supplier) => s.id === initialData.supplierId);
            if (supplier) {
              setSelectedSupplier(supplier);
            }
          }
        } else {
          setError('仕入先情報の取得に失敗しました');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('仕入先情報の取得に失敗しました');
      }
    };
    
    fetchSuppliers();
  }, [initialData?.supplierId]);

  const handleSave = async () => {
    if (!formData.supplierId || !formData.itemName || !formData.quantity || !formData.unitPrice) {
      setError('必須項目を入力してください');
      return;
    }

    try {
      setSaving(true);
      const data = {
        ...formData,
        date: formData.date.format('YYYY-MM-DD'),
      };

      let response: ApiResponse<any>;
      if (mode === 'create') {
        response = await purchasesApi.createOrder(data);
      } else if (initialData?.id) {
        response = await purchasesApi.updateOrder(initialData.id, data);
      } else {
        throw new Error('Invalid operation');
      }

      if (response.success) {
        router.push('/purchases/list');
      } else {
        setError(response.message || '登録に失敗しました');
      }
    } catch (error) {
      setError('登録に失敗しました');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getFormTitle = () => {
    if (type === 'order') {
      return mode === 'create' ? '発注登録' : '発注編集';
    } else {
      return mode === 'create' ? '仕入登録' : '仕入編集';
    }
  };

  const getDateLabel = () => {
    return type === 'order' ? '発注日' : '仕入日';
  };

  const getStatusOptions = () => {
    return type === 'order' ? PURCHASE_STATUS_OPTIONS : PURCHASE_RECEIPT_STATUS_OPTIONS;
  };

  const getDefaultStatus = () => {
    return type === 'order' ? '発注待ち' : '仕入待ち';
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <PageTitle title={getFormTitle()} />
      </Box>
      <FormLayout mode={mode}>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormDateField
                label={getDateLabel()}
                value={formData.date.format('YYYY-MM-DD')}
                onChange={(value) => setFormData((prev: PurchaseFormState) => ({
                  ...prev,
                  date: value ? dayjs(value) : dayjs()
                }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={suppliers}
                getOptionLabel={(option: Supplier) => option.name}
                value={selectedSupplier}
                onChange={(_, value) => {
                  setSelectedSupplier(value);
                  setFormData((prev: PurchaseFormState) => ({
                    ...prev,
                    supplierId: value?.id || ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="仕入先"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextField
                label="品名"
                value={formData.itemName}
                onChange={(value) => setFormData((prev: PurchaseFormState) => ({ ...prev, itemName: value }))}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormTextField
                label="数量"
                value={formData.quantity}
                onChange={(value) => setFormData((prev: PurchaseFormState) => ({ ...prev, quantity: value }))}
                required
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormMoneyField
                label="単価"
                value={formData.unitPrice ? parseInt(formData.unitPrice) : null}
                onChange={(value) => setFormData((prev: PurchaseFormState) => ({ ...prev, unitPrice: value ? value.toString() : '' }))}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormSelectField
                label="ステータス"
                value={formData.status}
                onChange={(value) => setFormData((prev: PurchaseFormState) => ({ ...prev, status: value }))}
                options={getStatusOptions().map((option) => ({
                  value: option.value,
                  label: option.label
                }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextField
                label="備考"
                value={formData.notes}
                onChange={(value) => setFormData((prev: PurchaseFormState) => ({ ...prev, notes: value }))}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <FormActions
                onSave={handleSave}
                onCancel={() => router.back()}
                mode={mode}
                disabled={saving}
              />
            </Grid>
          </Grid>
        </Box>
      </FormLayout>
    </>
  );
} 