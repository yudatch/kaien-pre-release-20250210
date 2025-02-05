"use client";

import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import PurchaseForm from './PurchaseForm';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { PurchaseFormState } from '@/app/types/components/features/purchases';

interface EditPurchaseProps {
  id: string;
  type: 'order' | 'purchase';
}

export default function EditPurchase({ id, type }: EditPurchaseProps) {
  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState<PurchaseFormState | null>(null);

  useEffect(() => {
    // ダミーデータを使用
    const fetchDummyData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // 擬似的な遅延
      setPurchaseData({
        date: dayjs(),
        supplierId: "supplier-1",
        itemName: "サンプル商品",
        quantity: "10",
        unitPrice: "1000",
        status: type === 'order' ? '発注待ち' : '仕入待ち',
        notes: "サンプルの備考です。",
      });
      setLoading(false);
    };

    fetchDummyData();
  }, [id, type]);

  const getTitle = () => type === 'order' ? "発注編集" : "仕入編集";

  if (loading) {
    return (
      <Box>
        <PageTitle title={getTitle()} />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!purchaseData) {
    return (
      <Box>
        <PageTitle title={getTitle()} />
        <div>データが見つかりませんでした。</div>
      </Box>
    );
  }

  return (
    <Box>
      <PageTitle title={getTitle()} />
      <PurchaseForm
        mode="edit"
        type={type}
        initialData={{ ...purchaseData, id }}
      />
    </Box>
  );
} 