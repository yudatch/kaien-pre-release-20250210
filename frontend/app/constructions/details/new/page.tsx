"use client";

import { Box, Paper } from '@mui/material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { useRouter } from 'next/navigation';
import ConstructionDetailForm from '@/app/components/features/constructions/ConstructionDetailForm';

export default function NewConstructionDetailPage() {
  const router = useRouter();

  return (
    <Box className="p-6">
      <PageTitle title="工事詳細登録" />
      <Paper elevation={0} className="p-6" sx={{ boxShadow: 'none !important' }}>
        <ConstructionDetailForm 
          mode="create" 
          onCancel={() => router.back()}
        />
      </Paper>
    </Box>
  );
} 