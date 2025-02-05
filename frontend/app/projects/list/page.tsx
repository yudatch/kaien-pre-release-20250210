"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add,
  Description,
  Receipt,
  Payments,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { projectsApi } from '../../api/projects';
import { Project, ProjectStatus, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/app/types/project';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { Column } from '@/app/types/components/core/table';
import { statusColors, statusLabels } from '@/app/types/pages/projects';
import { DeleteConfirmDialog } from '@/app/components/core/feedback/DeleteConfirmDialog';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { useDelete } from '@/app/hooks/useDelete';
import Link from 'next/link';
import { DataTable } from '@/app/components/core/display/DataTable';

type ProjectStatusColor = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

const columns: Column<Project>[] = [
  {
    field: 'project_code',
    headerName: '案件コード',
    width: 120,
  },
  {
    field: 'project_name',
    headerName: '案件名',
    width: 200,
  },
  {
    field: 'Customer',
    headerName: '顧客名',
    width: 200,
    valueGetter: ({ row }) => row.Customer?.name || '-',
  },
  {
    field: 'status',
    headerName: '受注状況',
    width: 120,
    renderCell: ({ row }) => (
      <Chip
        label={PROJECT_STATUS_LABELS[row.status as ProjectStatus]}
        color={PROJECT_STATUS_COLORS[row.status as ProjectStatus] as any}
        size="small"
      />
    ),
  },
  {
    field: 'actions',
    headerName: '',
    width: 120,
  },
];

const tableColumns: Column<Project>[] = [
  {
    field: 'project_code',
    headerName: '案件コード',
    width: 120,
    renderCell: ({ row }) => (
      <Link
        href={`/projects/${row.project_id}`}
        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
      >
        {row.project_code}
      </Link>
    ),
  },
  {
    field: 'project_name',
    headerName: '案件名',
    width: 200,
  },
  {
    field: 'customer_name',
    headerName: '顧客名',
    width: 200,
    valueGetter: ({ row }) => row.Customer?.name || '-',
  },
  {
    field: 'status',
    headerName: '受注状況',
    width: 120,
    renderCell: ({ row }) => (
      <Chip
        label={PROJECT_STATUS_LABELS[row.status as ProjectStatus]}
        color={PROJECT_STATUS_COLORS[row.status as ProjectStatus] as any}
        size="small"
      />
    ),
  },
  {
    field: 'documents',
    headerName: '書類',
    width: 200,
    renderCell: ({ row }) => (
      <ButtonGroup size="small" variant="outlined">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${row.project_id}/quotation-preview`);
          }}
          sx={{
            fontSize: '0.75rem',
            py: 0.5,
            borderColor: '#e0e0e0',
            color: '#666666',
            '&:hover': {
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            }
          }}
        >
          見積書
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${row.project_id}/invoice-preview`);
          }}
          sx={{
            fontSize: '0.75rem',
            py: 0.5,
            borderColor: '#e0e0e0',
            color: '#666666',
            '&:hover': {
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            }
          }}
        >
          請求書
        </Button>
      </ButtonGroup>
    ),
  },
];

export default function ProjectsListPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: projectToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<Project>({
    onSuccess: (deletedProject) => {
      setProjects(projects.filter(p => p.project_id !== deletedProject.project_id));
      setSuccessMessage('案件を削除しました。');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getProjects();
        if (response.success && Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          setError('案件データの形式が不正です');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('案件データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const executeDelete = async () => {
    if (!projectToDelete) return;
    await handleDeleteConfirm(async () => {
      try {
        const response = await projectsApi.deleteProject(projectToDelete.project_id);
        if (!response.success) {
          throw new Error(response.message || '案件の削除に失敗しました。');
        }
        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('案件の削除に失敗しました。');
      }
    });
  };

  const tableActions = [
    {
      icon: <EditIcon />,
      tooltip: '編集',
      onClick: (project: Project) => router.push(`/projects/${project.project_id}/edit`),
      color: 'primary' as const,
    },
    {
      icon: <DeleteIcon />,
      tooltip: '削除',
      onClick: handleDeleteClick,
      color: 'error' as const,
    }
  ];

  if (loading) {
    return (
      <Box>
        <PageTitle title="案件管理" />
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <PageTitle title="案件管理" />

        <ButtonGroup 
          variant="outlined" 
          sx={{ 
            '& .MuiButton-root': {
              borderColor: '#e0e0e0',
              color: '#666666',
              '&:hover': {
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.04)',
              }
            }
          }}
        >
          <Button 
            startIcon={<Add />}
            onClick={() => router.push('/projects/new')}
          >
            案件登録
          </Button>
          <Button 
            startIcon={<Description />}
            onClick={() => router.push('/projects/quotations')}
          >
            見積書
          </Button>
          <Button 
            startIcon={<Receipt />}
            onClick={() => router.push('/projects/invoices')}
          >
            請求書
          </Button>
          <Button 
            startIcon={<Payments />}
            onClick={() => router.push('/projects/payments/list')}
          >
            入金
          </Button>
        </ButtonGroup>
      </Box>

      {(error || deleteError) && (
        <FeedbackMessage message={error || deleteError} type="error" />
      )}
      {successMessage && (
        <FeedbackMessage message={successMessage} type="success" />
      )}

      <DataTable<Project>
        columns={tableColumns}
        rows={projects}
        loading={loading}
        getRowId={(row) => row.project_id}
        actions={tableActions}
        useButtonGroup={true}
        customTableStyle={{
          elevation: 0,
          border: '1px solid #e0e0e0',
          borderRadius: 2
        }}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="案件の削除"
        targetName={projectToDelete?.project_name}
        onCancel={handleDeleteCancel}
        onConfirm={executeDelete}
        isLoading={isDeleting}
      />
    </Box>
  );
} 