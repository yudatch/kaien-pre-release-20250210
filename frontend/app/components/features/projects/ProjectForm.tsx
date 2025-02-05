"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Autocomplete, TextField, SelectChangeEvent, Box, Button, MenuItem, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import FormLayout from '@/app/components/core/layout/FormLayout';
import { FormActions } from '@/app/components/core/form/FormActions';
import {
  FormTextField,
  FormMoneyField,
  FormDateField,
  FormSelectField,
} from '@/app/components/core/form/FormFields';
import { ProjectStatus, CreateProjectData, ContactHistory } from '@/app/types/project';
import { ProjectFormData } from '@/app/types/components/features/projects/forms';
import { Customer } from '@/app/types/customer';
import { projectsApi } from '@/app/api/projects';
import { customersApi } from '@/app/api/customers';
import { validateProject } from '@/app/utils/validation';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { transform } from 'next/dist/build/swc';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const STATUS_OPTIONS = [
  { value: ProjectStatus.DRAFT, label: '下書き' },
  { value: ProjectStatus.PROPOSAL, label: '提案中' },
  { value: ProjectStatus.WON, label: '受注' },
  { value: ProjectStatus.LOST, label: '失注' },
];

// 表示専用のステータスラベル
const STATUS_DISPLAY_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: '下書き',
  [ProjectStatus.PROPOSAL]: '提案中',
  [ProjectStatus.IN_PROGRESS]: '進行中',
  [ProjectStatus.COMPLETED]: '完了',
  [ProjectStatus.CANCELLED]: 'キャンセル',
  [ProjectStatus.WON]: '受注',
  [ProjectStatus.LOST]: '失注'
};

interface ProjectFormProps {
  projectId?: number;
  mode?: 'view' | 'edit' | 'create';
  onCancel?: () => void;
}

export default function ProjectForm({ projectId, mode = 'create', onCancel }: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    project_code: '',
    customer_id: undefined,
    project_name: '',
    description: '',
    start_date: '',
    end_date: '',
    expected_completion_date: '',
    sales_rep: undefined,
    status: ProjectStatus.DRAFT,
    contract_amount: undefined,
    contact_histories: [{
      contact_date: '',
      contact_time: '',
      contact_method: '',
      contact_person: '',
      contact_content: ''
    }]
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customersApi.getCustomers();
        if (response.success) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error('顧客データの取得に失敗しました:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const response = await projectsApi.getProject(projectId);
          if (response.success) {
            const contactHistories = response.data.contact_histories || [];
            setFormData({
              ...response.data,
              start_date: response.data.start_date ? dayjs(response.data.start_date).format('YYYY-MM-DD') : '',
              end_date: response.data.end_date ? dayjs(response.data.end_date).format('YYYY-MM-DD') : '',
              expected_completion_date: response.data.expected_completion_date ? dayjs(response.data.expected_completion_date).format('YYYY-MM-DD') : '',
              contact_histories: contactHistories.length > 0 ? contactHistories : [{
                contact_date: '',
                contact_time: '',
                contact_method: '',
                contact_person: '',
                contact_content: ''
              }]
            });
          }
        } catch (error) {
          console.error('プロジェクトの取得に失敗しました:', error);
          setError('プロジェクトの取得に失敗しました。');
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [projectId]);

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev: ProjectFormData) => ({
      ...prev,
      [field]: value
    }));

    // リアルタイムバリデーション
    const errors = validateProject({ ...formData, [field]: value });
    setValidationErrors(errors);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name as keyof ProjectFormData, value);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    handleChange(name as keyof ProjectFormData, value);
  };

  const handleStatusChange = (value: string) => {
    handleChange('status', value as ProjectStatus);
  };

  const handleDateChange = (field: keyof ProjectFormData) => (value: string | undefined) => {
    handleChange(field, value || '');
  };

  const handleMoneyChange = (field: keyof ProjectFormData) => (value: number | null) => {
    handleChange(field, value);
  };

  const handleSubmit = async () => {
    const errors = validateProject(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const projectData = {
        ...formData,
        customer_id: formData.customer_id || 0,
        start_date: formData.start_date ? dayjs(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? dayjs(formData.end_date).toISOString() : null,
        expected_completion_date: formData.expected_completion_date 
          ? dayjs(formData.expected_completion_date).toISOString() 
          : null
      };

      if (projectId) {
        const response = await projectsApi.updateProject(projectId, {
          ...projectData,
          project_id: projectId
        });
        if (response.success) {
          router.push(`/projects/${projectId}`);
        } else {
          setError(response.message || '案件の更新に失敗しました。');
        }
      } else {
        const response = await projectsApi.createProject(projectData);
        if (response.success) {
          router.push('/projects/list');
        } else {
          setError(response.message || '案件の作成に失敗しました。');
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setError('案件の保存中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  // 受注状況の選択可否を判定
  const isStatusSelectable = (currentStatus: ProjectStatus): boolean => {
    return mode === 'view' ? false : ![
      ProjectStatus.COMPLETED,
      ProjectStatus.CANCELLED
    ].includes(currentStatus);
  };

  const handleAddContactHistory = () => {
    setFormData((prev: ProjectFormData) => ({
      ...prev,
      contact_histories: [
        ...prev.contact_histories,
        {
          contact_date: '',
          contact_time: '',
          contact_method: '',
          contact_person: '',
          contact_content: ''
        }
      ]
    }));
  };

  const handleDeleteContactHistory = (index: number) => {
    setFormData((prev: ProjectFormData) => ({
      ...prev,
      contact_histories: prev.contact_histories.filter((_, i: number) => i !== index)
    }));
  };

  const handleContactHistoryChange = (index: number, field: keyof ContactHistory, value: string) => {
    setFormData((prev: ProjectFormData) => ({
      ...prev,
      contact_histories: prev.contact_histories.map((history: ContactHistory, i: number) => {
        if (i === index) {
          return {
            ...history,
            [field]: value
          };
        }
        return history;
      })
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <FormLayout mode={mode}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormTextField
            label="案件名"
            value={formData.project_name}
            onChange={(value) => handleChange('project_name', value)}
            required
            disabled={mode === 'view'}
            error={!!validationErrors.project_name}
            helperText={validationErrors.project_name}
            variant="standard"
            InputProps={{
              readOnly: mode === 'view',
              disableUnderline: mode === 'view',
              sx: mode === 'view' ? {
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'unset',
                  cursor: 'default',
                  padding: 0
                },
                '&:before': { display: 'none' },
                '&:after': { display: 'none' }
              } : {
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormSelectField
            label="取引先"
            value={formData.customer_id}
            onChange={(value) => handleChange('customer_id', value)}
            options={customers.map(customer => ({
              value: customer.customer_id,
              label: customer.name
            }))}
            required
            disabled={mode === 'view'}
            error={!!validationErrors.customer_id}
            helperText={validationErrors.customer_id}
            variant="standard"
            InputProps={{
              readOnly: mode === 'view',
              disableUnderline: mode === 'view',
              sx: mode === 'view' ? {
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'unset',
                  cursor: 'default',
                  padding: 0
                },
                '&:before': { display: 'none' },
                '&:after': { display: 'none' }
              } : {
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormTextField
            label="説明"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            multiline
            rows={4}
            disabled={mode === 'view'}
            error={!!validationErrors.description}
            helperText={validationErrors.description}
            variant="standard"
            InputProps={{
              readOnly: mode === 'view',
              disableUnderline: mode === 'view',
              sx: mode === 'view' ? {
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'unset',
                  cursor: 'default',
                  padding: 0
                },
                '&:before': { display: 'none' },
                '&:after': { display: 'none' }
              } : {
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormDateField
            label="開始日"
            value={formData.start_date}
            onChange={(value) => handleChange('start_date', value)}
            disabled={mode === 'view'}
            error={!!validationErrors.start_date}
            helperText={validationErrors.start_date}
            variant="standard"
            InputProps={{
              readOnly: mode === 'view',
              disableUnderline: mode === 'view',
              sx: mode === 'view' ? {
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'unset',
                  cursor: 'default',
                  padding: 0
                },
                '&:before': { display: 'none' },
                '&:after': { display: 'none' },
                '& .MuiIconButton-root': { display: 'none' }
              } : {
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormDateField
            label="終了日"
            value={formData.end_date}
            onChange={(value) => handleChange('end_date', value)}
            disabled={mode === 'view'}
            error={!!validationErrors.end_date}
            helperText={validationErrors.end_date}
            variant="standard"
            InputProps={{
              readOnly: mode === 'view',
              disableUnderline: mode === 'view',
              sx: mode === 'view' ? {
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'unset',
                  cursor: 'default',
                  padding: 0
                },
                '&:before': { display: 'none' },
                '&:after': { display: 'none' },
                '& .MuiIconButton-root': { display: 'none' }
              } : {
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormDateField
            label="完了予定日"
            value={formData.expected_completion_date}
            onChange={(value) => handleChange('expected_completion_date', value)}
            disabled={mode === 'view'}
            error={!!validationErrors.expected_completion_date}
            helperText={validationErrors.expected_completion_date}
            variant="standard"
            InputProps={{
              readOnly: mode === 'view',
              disableUnderline: mode === 'view',
              sx: mode === 'view' ? {
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'unset',
                  cursor: 'default',
                  padding: 0
                },
                '&:before': { display: 'none' },
                '&:after': { display: 'none' },
                '& .MuiIconButton-root': { display: 'none' }
              } : {
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {isStatusSelectable(formData.status) ? (
            <FormSelectField
              label="受注状況"
              value={formData.status}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
              required
              disabled={mode === 'view'}
              error={!!validationErrors.status}
              helperText={validationErrors.status}
              variant="standard"
              InputProps={{
                readOnly: mode === 'view',
                disableUnderline: mode === 'view',
                sx: mode === 'view' ? {
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                    WebkitTextFillColor: 'unset',
                    cursor: 'default',
                    padding: 0
                  },
                  '&:before': { display: 'none' },
                  '&:after': { display: 'none' }
                } : {
                  '& .MuiInputBase-input': {
                    padding: '4px 0'
                  }
                }
              }}
            />
          ) : (
            <FormTextField
              label="受注状況"
              value={STATUS_DISPLAY_LABELS[formData.status]}
              onChange={() => {}}
              disabled
              variant="standard"
              InputProps={{
                readOnly: true,
                disableUnderline: true,
                sx: {
                  '& .MuiInputBase-input': {
                    color: 'text.primary',
                    WebkitTextFillColor: 'unset',
                    cursor: 'default',
                    padding: 0,
                  },
                  '&:before': { display: 'none' },
                  '&:after': { display: 'none' }
                }
              }}
            />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <FormMoneyField
            label="契約金額"
            value={formData.contract_amount}
            onChange={(value) => handleChange('contract_amount', value)}
            disabled={mode === 'view'}
            error={!!validationErrors.contract_amount}
            helperText={validationErrors.contract_amount}
            variant="standard"
            InputProps={{
              readOnly: mode === 'view',
              disableUnderline: mode === 'view',
              sx: mode === 'view' ? {
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'unset',
                  cursor: 'default',
                  padding: 0
                },
                '&:before': { display: 'none' },
                '&:after': { display: 'none' }
              } : {
                '& .MuiInputBase-input': {
                  padding: '4px 0'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">コンタクト履歴</Typography>
            {mode !== 'view' && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddContactHistory}
                size="small"
              >
                コンタクト追加
              </Button>
            )}
          </Box>
          <Grid container spacing={2}>
            {formData.contact_histories.map((history: ContactHistory, index: number) => (
              <Grid item xs={12} key={index} sx={{ 
                backgroundColor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                position: 'relative'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormTextField
                      label="連絡日"
                      type="date"
                      value={history.contact_date}
                      onChange={(value) => handleContactHistoryChange(index, 'contact_date', value)}
                      disabled={mode === 'view'}
                      variant="standard"
                      InputProps={{
                        readOnly: mode === 'view',
                        disableUnderline: mode === 'view',
                        sx: mode === 'view' ? {
                          '& .MuiInputBase-input': {
                            color: 'text.primary',
                            WebkitTextFillColor: 'unset',
                            cursor: 'default',
                            padding: 0
                          },
                          '&:before': { display: 'none' },
                          '&:after': { display: 'none' }
                        } : {
                          '& .MuiInputBase-input': {
                            padding: '4px 0'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormTextField
                      label="連絡時間"
                      type="time"
                      value={history.contact_time}
                      onChange={(value) => handleContactHistoryChange(index, 'contact_time', value)}
                      disabled={mode === 'view'}
                      variant="standard"
                      InputProps={{
                        readOnly: mode === 'view',
                        disableUnderline: mode === 'view',
                        sx: mode === 'view' ? {
                          '& .MuiInputBase-input': {
                            color: 'text.primary',
                            WebkitTextFillColor: 'unset',
                            cursor: 'default',
                            padding: 0
                          },
                          '&:before': { display: 'none' },
                          '&:after': { display: 'none' }
                        } : {
                          '& .MuiInputBase-input': {
                            padding: '4px 0'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormTextField
                      label="方法/内容"
                      value={history.contact_method}
                      onChange={(value) => handleContactHistoryChange(index, 'contact_method', value)}
                      disabled={mode === 'view'}
                      variant="standard"
                      InputProps={{
                        readOnly: mode === 'view',
                        disableUnderline: mode === 'view',
                        sx: mode === 'view' ? {
                          '& .MuiInputBase-input': {
                            color: 'text.primary',
                            WebkitTextFillColor: 'unset',
                            cursor: 'default',
                            padding: 0
                          },
                          '&:before': { display: 'none' },
                          '&:after': { display: 'none' }
                        } : {
                          '& .MuiInputBase-input': {
                            padding: '4px 0'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormTextField
                      label="営業担当者"
                      value={history.contact_person}
                      onChange={(value) => handleContactHistoryChange(index, 'contact_person', value)}
                      disabled={mode === 'view'}
                      variant="standard"
                      InputProps={{
                        readOnly: mode === 'view',
                        disableUnderline: mode === 'view',
                        sx: mode === 'view' ? {
                          '& .MuiInputBase-input': {
                            color: 'text.primary',
                            WebkitTextFillColor: 'unset',
                            cursor: 'default',
                            padding: 0
                          },
                          '&:before': { display: 'none' },
                          '&:after': { display: 'none' }
                        } : {
                          '& .MuiInputBase-input': {
                            padding: '4px 0'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormTextField
                      label="商談内容"
                      value={history.contact_content}
                      onChange={(value) => handleContactHistoryChange(index, 'contact_content', value)}
                      disabled={mode === 'view'}
                      multiline
                      rows={2}
                      variant="standard"
                      InputProps={{
                        readOnly: mode === 'view',
                        disableUnderline: mode === 'view',
                        sx: mode === 'view' ? {
                          '& .MuiInputBase-input': {
                            color: 'text.primary',
                            WebkitTextFillColor: 'unset',
                            cursor: 'default',
                            padding: 0
                          },
                          '&:before': { display: 'none' },
                          '&:after': { display: 'none' }
                        } : {
                          '& .MuiInputBase-input': {
                            padding: '4px 0'
                          }
                        }
                      }}
                    />
                  </Grid>
                  {mode !== 'view' && (
                    <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconButton
                        onClick={() => handleDeleteContactHistory(index)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {mode !== 'view' && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                キャンセル
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || Object.keys(validationErrors).length > 0}
              >
                {loading ? '保存中...' : '保存'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {error && (
        <Box mb={2}>
          <FeedbackMessage message={error} type="error" />
        </Box>
      )}
    </FormLayout>
  );
} 