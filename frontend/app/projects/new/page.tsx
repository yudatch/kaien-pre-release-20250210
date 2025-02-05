"use client";

import { Box, Paper } from '@mui/material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { useRouter } from 'next/navigation';

const ProjectForm = dynamic(() => import('@/app/components/features/projects/ProjectForm'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <Box className="p-6">
      <PageTitle title="案件登録" />
      <Paper elevation={0} className="p-6" sx={{ boxShadow: 'none !important' }}>
        <ProjectForm 
          mode="create"
          onCancel={() => router.back()}
        />
      </Paper>
    </Box>
  );
} 