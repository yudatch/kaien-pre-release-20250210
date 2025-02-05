"use client";

import EditPurchase from '@/app/components/features/purchases/EditPurchase';

interface EditOrderPageProps {
  params: {
    id: string;
  };
}

export default function EditOrderPage({ params }: EditOrderPageProps) {
  return <EditPurchase id={params.id} type="order" />;
} 