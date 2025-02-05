"use client";

import PaymentList from '@/app/components/features/projects/PaymentList';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';

export default function PaymentListPage() {
  return (
    <ListPageLayout title="入金予定">
      <PaymentList />
    </ListPageLayout>
  );
} 