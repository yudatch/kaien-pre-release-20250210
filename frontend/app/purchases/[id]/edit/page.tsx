"use client";

import EditPurchase from '@/app/components/features/purchases/EditPurchase';

interface EditPurchasePageProps {
  params: {
    id: string;
  };
}

export default function EditPurchasePage({ params }: EditPurchasePageProps) {
  return <EditPurchase id={params.id} type="purchase" />;
} 