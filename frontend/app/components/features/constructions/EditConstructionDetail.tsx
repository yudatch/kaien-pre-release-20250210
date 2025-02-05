"use client";

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ConstructionDetailForm from './ConstructionDetailForm';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';
import { getConstructionDetail } from '@/app/api/constructions';
import { ConstructionDetail } from '@/app/types/api/constructions';

type EditConstructionDetailProps = {
  constructionId: number;
};

export default function EditConstructionDetail({ constructionId }: EditConstructionDetailProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [constructionData, setConstructionData] = useState<ConstructionDetail | null>(null);

  useEffect(() => {
    const fetchConstructionDetail = async () => {
      try {
        const data = await getConstructionDetail(constructionId);
        setConstructionData(data);
      } catch (error) {
        console.error('Error fetching construction detail:', error);
        setError('工事詳細データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchConstructionDetail();
  }, [constructionId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FeedbackMessage message={error} type="error" />;
  }

  if (!constructionData) {
    return <FeedbackMessage message="工事詳細データが見つかりません。" type="error" />;
  }

  return (
    <Box>
      <ConstructionDetailForm
        mode="edit"
        initialData={constructionData}
        onLoading={setLoading}
      />
    </Box>
  );
} 