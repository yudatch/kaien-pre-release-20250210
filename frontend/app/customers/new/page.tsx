"use client";

import { Box, Paper } from '@mui/material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { useRouter } from 'next/navigation';

const CustomerForm = dynamic(() => import('@/app/components/features/customers/CustomerForm'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function NewCustomerPage() {
  const router = useRouter();

  return (
    <Box className="p-6">
      <PageTitle title="顧客登録" />
      <Paper elevation={0} className="p-6" sx={{ boxShadow: 'none !important' }}>
        <CustomerForm 
          mode="create" 
          onCancel={() => router.back()}
        />
      </Paper>
    </Box>
  );
} 