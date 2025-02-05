"use client";

import { useParams, useRouter } from 'next/navigation';
import { Box, Button } from '@mui/material';
import { Visibility as VisibilityIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import EditConstructionDetail from '@/app/components/features/constructions/EditConstructionDetail';

export default function EditConstructionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const constructionId = params?.id ? parseInt(params.id as string) : 0;

  if (!constructionId) {
    return null;
  }

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="工事編集" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/constructions/list')}
            sx={{
              borderColor: '#e0e0e0',
              color: '#666666',
              '&:hover': {
                borderColor: '#666666',
                backgroundColor: 'rgba(102, 102, 102, 0.04)'
              }
            }}
          >
            一覧へ戻る
          </Button>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => router.push(`/constructions/details/${constructionId}`)}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            詳細
          </Button>
        </Box>
      </Box>
      <EditConstructionDetail constructionId={constructionId} />
    </Box>
  );
} 