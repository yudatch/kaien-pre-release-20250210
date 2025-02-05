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
  Button,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { customersApi } from '@/app/api/customers';
import { Customer } from '@/app/types/customer';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { DeleteConfirmDialog } from '@/app/components/core/feedback/DeleteConfirmDialog';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { useDelete } from '@/app/hooks/useDelete';
import Link from 'next/link';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isLoading: isDeleting,
    error: deleteError,
    itemToDelete: customerToDelete,
    isDialogOpen: deleteDialogOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDelete<Customer>({
    onSuccess: (deletedCustomer) => {
      setCustomers(customers.filter(c => c.customer_id !== deletedCustomer.customer_id));
      setSuccessMessage('顧客情報を削除しました。');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customersApi.getCustomers();
        if (response.success) {
          setCustomers(response.data);
        } else {
          setError(response.message || '顧客データの取得に失敗しました。');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError(error instanceof Error ? error.message : '顧客データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/customers/${id}/edit`);
  };

  const executeDelete = async () => {
    if (!customerToDelete) return;
    await handleDeleteConfirm(async () => {
      const response = await customersApi.deleteCustomer(customerToDelete.customer_id);
      return response;
    });
  };

  if (loading) {
    return (
      <Box>
        <PageTitle title="顧客管理" />
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
        <PageTitle title="顧客管理" />

        <Button 
          variant="outlined"
          startIcon={<Add />}
          onClick={() => router.push('/customers/new')}
          sx={{ 
            borderColor: '#e0e0e0',
            color: '#666666',
            '&:hover': {
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            }
          }}
        >
          顧客情報登録
        </Button>
      </Box>

      {(error || deleteError) && (
        <FeedbackMessage message={error || deleteError} type="error" />
      )}
      {successMessage && (
        <FeedbackMessage message={successMessage} type="success" />
      )}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>顧客コード</TableCell>
              <TableCell>会社名</TableCell>
              <TableCell>担当者名</TableCell>
              <TableCell>メールアドレス</TableCell>
              <TableCell>電話番号</TableCell>
              <TableCell>備考</TableCell>
              <TableCell align="center">アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.customer_id} hover>
                <TableCell>
                  <Link
                    href={`/customers/${customer.customer_id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {customer.customer_code}
                  </Link>
                </TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.contact_person}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.notes}</TableCell>
                <TableCell align="center">
                  <ButtonGroup size="small">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(customer.customer_id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(customer)}
                    >
                      <Delete />
                    </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="顧客の削除"
        targetName={customerToDelete?.name}
        onCancel={handleDeleteCancel}
        onConfirm={executeDelete}
        isLoading={isDeleting}
      />
    </Box>
  );
} 