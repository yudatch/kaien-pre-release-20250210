"use client";

import { useRouter } from 'next/navigation';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import { Box } from '@mui/material';

export default function OrdersPage() {
  const router = useRouter();

  return (
    <ListPageLayout
      title="発注一覧"
      addButtonLabel="発注登録"
      onAddClick={() => router.push('/purchases/orders/new')}
    >
      <Box>
        {/* 発注一覧は /purchases/orders/list/page.tsx に移動しました */}
      </Box>
    </ListPageLayout>
  );
} 