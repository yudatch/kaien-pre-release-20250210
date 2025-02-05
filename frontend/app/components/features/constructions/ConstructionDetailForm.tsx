"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box, Slider, Typography } from '@mui/material';
import FormLayout from '@/app/components/core/layout/FormLayout';
import { FormTextField, FormDateField, FormSelectField, FormMoneyField } from '@/app/components/core/form/FormFields';
import { FormActions } from '@/app/components/core/form/FormActions';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { ConstructionDetail, CreateConstructionDetailRequest, ConstructionDetailStatus } from '@/app/types/api/constructions';
import { createConstructionDetail, updateConstructionDetail } from '@/app/api/constructions';
import { projectsApi } from '@/app/api/projects';
import { purchasesApi } from '@/app/api/purchases';
import { Project } from '@/app/types/project';
import { validateConstructionDetail } from '@/app/utils/validation';

type Contractor = {
  supplier_id: number;
  name: string;
};

type ApiSupplier = {
  supplier_id: number;
  supplier_code: string;
  name: string;
};

const STATUS_OPTIONS = [
  { value: 'planned', label: '準備中' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' },
  { value: 'cancelled', label: '中止' },
];

type ConstructionDetailFormProps = {
  mode?: 'create' | 'edit' | 'view';
  initialData?: ConstructionDetail;
  onCancel?: () => void;
  onLoading?: (loading: boolean) => void;
};

interface ValidationErrors {
  project_id?: string;
  contractor_id?: string;
  construction_date?: string;
  completion_date?: string;
  unit_price?: string;
  status?: string;
  progress?: string;
  notes?: string;
}

export default function ConstructionDetailForm({ mode = 'create', initialData, onCancel, onLoading }: ConstructionDetailFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateConstructionDetailRequest>(() => {
    if (initialData && mode === 'edit') {
      return {
        project_id: initialData.project_id,
        contractor_id: initialData.contractor_id,
        construction_date: initialData.construction_date || null,
        completion_date: initialData.completion_date || null,
        unit_price: Number(initialData.unit_price),
        status: initialData.status,
        notes: initialData.notes || '',
        progress: initialData.progress,
      };
    }
    return {
      project_id: 0,
      contractor_id: 0,
      construction_date: null,
      completion_date: null,
      unit_price: 0,
      status: 'planned' as ConstructionDetailStatus,
      notes: '',
      progress: 0,
    };
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [projectsResponse, suppliersResponse] = await Promise.all([
          projectsApi.getProjects(),
          purchasesApi.getMasterSuppliers()
        ]);

        if (projectsResponse.success && Array.isArray(projectsResponse.data)) {
          setProjects(projectsResponse.data);
        }

        if (suppliersResponse.success && Array.isArray(suppliersResponse.data)) {
          const rawSuppliers = suppliersResponse.data as unknown as Array<{supplier_id: number; name: string}>;
          const formattedContractors = rawSuppliers.map(supplier => ({
            supplier_id: supplier.supplier_id,
            name: supplier.name
          }));
          setContractors(formattedContractors);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
        setError('マスターデータの取得に失敗しました');
      }
    };

    fetchMasterData();
  }, []);

  const handleChange = (field: keyof CreateConstructionDetailRequest, value: any) => {
    let newValue = value;

    // 値の変換処理
    if (field === 'construction_date' || field === 'completion_date') {
      newValue = value && value !== 'Invalid date' ? value : null;
    } else if (field === 'project_id' || field === 'contractor_id') {
      newValue = value === '' ? 0 : Number(value);
    }

    // フォームデータの更新
    setFormData(prev => ({
      ...prev,
      [field]: newValue,
    }));

    // 変更されたフィールドのみバリデーション
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'project_id':
        if (!newValue || newValue === 0) {
          errors.project_id = 'プロジェクトは必須です';
        } else {
          delete errors.project_id;
        }
        break;
        
      case 'contractor_id':
        if (!newValue || newValue === 0) {
          errors.contractor_id = '業者は必須です';
        } else {
          delete errors.contractor_id;
        }
        break;
        
      case 'progress':
        const progressValue = Number(newValue);
        if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
          errors.progress = '進捗は0から100の間で入力してください';
        } else {
          delete errors.progress;
        }
        break;
        
      case 'unit_price':
        const priceValue = Number(newValue);
        if (isNaN(priceValue) || priceValue < 0) {
          errors.unit_price = '単価は0以上を入力してください';
        } else {
          delete errors.unit_price;
        }
        break;
    }

    setValidationErrors(errors);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // 必須項目のチェック
    if (!formData.project_id || formData.project_id === 0) {
      errors.project_id = 'プロジェクトは必須です';
    }
    if (!formData.contractor_id || formData.contractor_id === 0) {
      errors.contractor_id = '業者は必須です';
    }

    // 進捗のバリデーション
    if (formData.progress < 0 || formData.progress > 100) {
      errors.progress = '進捗は0から100の間で入力してください';
    }

    // 単価のバリデーション
    if (formData.unit_price < 0) {
      errors.unit_price = '単価は0以上を入力してください';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // バリデーションチェック
    if (!validateForm()) {
      return;
    }

    try {
      onLoading?.(true);

      // 送信データの準備
      const submitData = {
        ...formData,
        construction_date: formData.construction_date || null,
        completion_date: formData.completion_date || null,
      };

      if (mode === 'edit' && initialData) {
        await updateConstructionDetail(initialData.construction_id, submitData);
      } else {
        await createConstructionDetail(submitData);
      }

      router.push('/constructions/list');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      onLoading?.(false);
    }
  };

  // フォームが有効かどうかをチェック
  const isFormValid = (): boolean => {
    // プロジェクトと業者は必須
    if (!formData.project_id || formData.project_id === 0) return false;
    if (!formData.contractor_id || formData.contractor_id === 0) return false;

    // 進捗は0-100の範囲内
    if (formData.progress < 0 || formData.progress > 100) return false;

    // 単価は0以上
    if (formData.unit_price < 0) return false;

    return true;
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <FormLayout mode={mode}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormSelectField
            label="プロジェクト"
            value={formData.project_id === 0 ? '' : formData.project_id.toString()}
            onChange={(value) => handleChange('project_id', value)}
            options={[
              { value: '', label: 'プロジェクトを選択' },
              ...projects.map(project => ({
                value: project.project_id.toString(),
                label: project.project_name
              }))
            ]}
            required
            error={!!validationErrors.project_id}
            helperText={validationErrors.project_id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormSelectField
            label="業者"
            value={formData.contractor_id === 0 ? '' : formData.contractor_id.toString()}
            onChange={(value) => handleChange('contractor_id', value)}
            options={[
              { value: '', label: '業者を選択' },
              ...contractors.map(contractor => ({
                value: contractor.supplier_id.toString(),
                label: contractor.name
              }))
            ]}
            required
            error={!!validationErrors.contractor_id}
            helperText={validationErrors.contractor_id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormDateField
            label="着工日"
            value={formData.construction_date || null}
            onChange={(value) => handleChange('construction_date', value)}
            error={!!validationErrors.construction_date}
            helperText={validationErrors.construction_date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormDateField
            label="完了予定日"
            value={formData.completion_date || null}
            onChange={(value) => handleChange('completion_date', value)}
            error={!!validationErrors.completion_date}
            helperText={validationErrors.completion_date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormMoneyField
            label="単価"
            value={formData.unit_price}
            onChange={(value) => handleChange('unit_price', value || 0)}
            error={!!validationErrors.unit_price}
            helperText={validationErrors.unit_price}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormSelectField
            label="ステータス"
            value={formData.status}
            onChange={(value) => handleChange('status', value as ConstructionDetailStatus)}
            options={STATUS_OPTIONS}
            error={!!validationErrors.status}
            helperText={validationErrors.status}
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
        <Grid item xs={12} md={6}>
          <FormTextField
            label="進捗"
            value={formData.progress.toString()}
            onChange={(value) => handleChange('progress', Number(value))}
            type="number"
            error={!!validationErrors.progress}
            helperText={validationErrors.progress}
          />
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                進捗状況
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.progress}%
              </Typography>
            </Box>
            <Slider
              value={formData.progress}
              onChange={(_, value) => handleChange('progress', value as number)}
              sx={{
                height: 10,
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)'
                  }
                },
                '& .MuiSlider-track': {
                  backgroundColor: formData.progress === 100 ? '#4caf50' : '#1976d2',
                  height: 10,
                  borderRadius: 5
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#e0e0e0',
                  height: 10,
                  borderRadius: 5
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <FormActions
          mode={mode}
          onSave={handleSubmit}
          onCancel={handleCancel}
          disabled={!isFormValid()}
        />
      </Box>
    </FormLayout>
  );
} 