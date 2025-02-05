"use client";

import { Box, Button } from '@mui/material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import dynamic from 'next/dynamic';
import { Edit, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const ProjectForm = dynamic(() => import('@/app/components/features/projects/ProjectForm'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="案件詳細" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/projects/list')}
          >
            一覧へ戻る
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => router.push(`/projects/${params.id}/edit`)}
          >
            編集
          </Button>
        </Box>
      </Box>
      <Box>
        <ProjectForm projectId={parseInt(params.id)} mode="view" />
      </Box>
    </Box>
  );
} 