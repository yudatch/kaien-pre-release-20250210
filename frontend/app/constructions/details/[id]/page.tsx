"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Paper, Typography, Grid, Button, LinearProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { ConstructionDetail } from '@/app/types/api/constructions';
import { getConstructionDetail } from '@/app/api/constructions';
import { formatDate } from '@/app/utils/date';
import { formatMoney } from '@/app/utils/money';

const STATUS_MAP = {
  'not_started': '未着工',
  'in_progress': '工事中',
  'completed': '完了',
  'cancelled': '中止'
};

export default function ConstructionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [construction, setConstruction] = useState<ConstructionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConstruction = async () => {
      try {
        const data = await getConstructionDetail(Number(params.id));
        setConstruction(data);
      } catch (err) {
        setError('工事情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchConstruction();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <FeedbackMessage message={error} type="error" />;
  if (!construction) return <FeedbackMessage message="工事情報が見つかりません" type="error" />;

  return (
    <Box className="p-6">
      <Box sx={{ mb: 3 }}>
        <PageTitle title="工事詳細" />
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
            startIcon={<EditIcon />}
            onClick={() => router.push(`/constructions/details/${params.id}/edit`)}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            編集
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {construction.Project.project_name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              工事番号
            </Typography>
            <Typography variant="body1">
              {construction.construction_id}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              業者名
            </Typography>
            <Typography variant="body1">
              {construction.Contractor.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              着工日
            </Typography>
            <Typography variant="body1">
              {formatDate(construction.construction_date)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              完工日
            </Typography>
            <Typography variant="body1">
              {formatDate(construction.completion_date)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              単価
            </Typography>
            <Typography variant="body1">
              {formatMoney(construction.unit_price)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              ステータス
            </Typography>
            <Typography variant="body1">
              {STATUS_MAP[construction.status as keyof typeof STATUS_MAP]}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  進捗状況
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {construction.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={construction.progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: construction.progress === 100 ? '#4caf50' : '#1976d2'
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              備考
            </Typography>
            <Typography variant="body1">
              {construction.notes || ''}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
} 