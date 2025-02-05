"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box } from '@mui/material';
import FormLayout from '@/app/components/core/layout/FormLayout';
import { FormActions } from '@/app/components/core/form/FormActions';
import {
  FormTextField,
  FormSelectField,
} from '@/app/components/core/form/FormFields';
import { CustomerFormData } from '@/app/types/components/features/customers/forms';
import { customersApi } from '@/app/api/customers';
import { CreateCustomerData } from '@/app/types/customer';
import { validateCustomer } from '@/app/utils/validation';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { FormSelect } from '@/app/components/core/forms/FormSelect';
import { PAYMENT_TERMS_OPTIONS, PAYMENT_DUE_DAYS_OPTIONS } from '@/app/constants/payment';

interface CustomerFormProps {
  customerId?: number;
  mode?: 'view' | 'edit' | 'create';
  onCancel?: () => void;
  onLoading?: (isLoading: boolean) => void;
}

export default function CustomerForm({ customerId, mode = 'create', onCancel, onLoading }: CustomerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CustomerFormData>({
    customer_code: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    postal_code: '',
    tax_id: '',
    payment_terms: null,
    payment_due_days: null,
    notes: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

  useEffect(() => {
    if (customerId && mode !== 'create') {
      const fetchCustomer = async () => {
        try {
          onLoading?.(true);
          const response = await customersApi.getCustomer(customerId);
          if (response.success) {
            setFormData({
              customer_code: response.data.customer_code,
              name: response.data.name,
              contact_person: response.data.contact_person || '',
              email: response.data.email || '',
              phone: response.data.phone || '',
              address: response.data.address || '',
              postal_code: response.data.postal_code || '',
              tax_id: response.data.tax_id || '',
              payment_terms: response.data.payment_terms === null ? null : Number(response.data.payment_terms),
              payment_due_days: response.data.payment_due_days === null ? null : Number(response.data.payment_due_days),
              notes: response.data.notes || '',
              is_active: response.data.is_active,
            });
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          setError('顧客データの取得に失敗しました。');
        } finally {
          onLoading?.(false);
        }
      };
      fetchCustomer();
    } else {
      onLoading?.(false);
    }
  }, [customerId, mode, onLoading]);

  const handleChange = (field: keyof CustomerFormData, value: any) => {
    let processedValue = value;
    if (field === 'payment_terms') {
      processedValue = value === '' ? null : (Number(value) as 1 | 2 | 3 | 4 | 5);
    } else if (field === 'payment_due_days') {
      processedValue = value === '' ? null : (Number(value) as 0 | 30 | 60 | 90);
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
    
    // リアルタイムバリデーション
    const errors = validateCustomer({ ...formData, [field]: processedValue });
    setValidationErrors(errors);
    setError(null);
  };

  const handleSubmit = async () => {
    const errors = validateCustomer(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      onLoading?.(true);
      setError(null);

      const submitData: CreateCustomerData = {
        name: formData.name,
        contact_person: formData.contact_person || null,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        postal_code: formData.postal_code || null,
        tax_id: formData.tax_id || null,
        payment_terms: formData.payment_terms,
        payment_due_days: formData.payment_due_days,
        notes: formData.notes || null,
        is_active: formData.is_active,
      };

      if (mode === 'create') {
        const response = await customersApi.createCustomer(submitData);
        if (response.success) {
          router.push('/customers/list');
        } else {
          setError('顧客データの保存に失敗しました。');
        }
      } else if (mode === 'edit' && customerId) {
        const response = await customersApi.updateCustomer(customerId, submitData);
        if (response.success) {
          router.push('/customers/list');
        } else {
          setError('顧客データの保存に失敗しました。');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('顧客データの保存に失敗しました。');
    } finally {
      onLoading?.(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <FormLayout mode={mode}>
      <Grid container spacing={3}>
        {mode === 'view' && (
          <>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="顧客コード"
                value={formData.customer_code}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="会社名"
                value={formData.name}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="担当者名"
                value={formData.contact_person}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="メールアドレス"
                value={formData.email}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="電話番号"
                value={formData.phone}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="郵便番号"
                value={formData.postal_code}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="住所"
                value={formData.address}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="適格事業者番号"
                value={formData.tax_id}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="支払条件"
                value={formData.payment_terms ? PAYMENT_TERMS_OPTIONS.find(opt => opt.value === formData.payment_terms)?.label || '' : ''}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="支払期限日数"
                value={formData.payment_due_days !== null ? PAYMENT_DUE_DAYS_OPTIONS.find(opt => opt.value === formData.payment_due_days)?.label || '' : ''}
                onChange={() => {}}
                disabled={true}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                label="備考"
                value={formData.notes}
                onChange={() => {}}
                disabled={true}
                variant="standard"
                multiline
                rows={4}
              />
            </Grid>
          </>
        )}
        {mode !== 'view' && (
          <>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="会社名"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="担当者名"
                value={formData.contact_person}
                onChange={(value) => handleChange('contact_person', value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="メールアドレス"
                value={formData.email}
                onChange={(value) => handleChange('email', value)}
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="電話番号"
                value={formData.phone}
                onChange={(value) => handleChange('phone', value)}
                type="tel"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="郵便番号"
                value={formData.postal_code}
                onChange={(value) => handleChange('postal_code', value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="住所"
                value={formData.address}
                onChange={(value) => handleChange('address', value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="適格事業者番号"
                value={formData.tax_id}
                onChange={(value) => handleChange('tax_id', value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormSelectField
                label="支払条件"
                value={formData.payment_terms || ''}
                onChange={(e) => handleChange('payment_terms', e.target.value)}
                options={PAYMENT_TERMS_OPTIONS}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormSelectField
                label="支払期限日数"
                value={formData.payment_due_days || ''}
                onChange={(e) => handleChange('payment_due_days', e.target.value)}
                options={PAYMENT_DUE_DAYS_OPTIONS}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                label="備考"
                value={formData.notes}
                onChange={(value) => handleChange('notes', value)}
                multiline
                rows={4}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Box mt={3}>
        <FormActions
          onSave={handleSubmit}
          onCancel={handleCancel}
          mode={mode}
        />
      </Box>
      {error && <FeedbackMessage type="error" message={error} />}
    </FormLayout>
  );
} 