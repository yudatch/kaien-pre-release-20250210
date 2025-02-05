"use client";

import { useParams, useRouter } from 'next/navigation';
import { Box, Button } from '@mui/material';
import { Visibility, ArrowBack } from '@mui/icons-material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import CustomerForm from '@/app/components/features/customers/CustomerForm';

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = parseInt(params.id as string);

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="顧客編集" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/customers/list')}
          >
            一覧へ戻る
          </Button>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => router.push(`/customers/${customerId}`)}
          >
            詳細
          </Button>
        </Box>
      </Box>
      <CustomerForm 
        mode="edit" 
        customerId={customerId} 
        onCancel={() => router.push(`/customers/${customerId}`)}
      />
    </Box>
  );
} 