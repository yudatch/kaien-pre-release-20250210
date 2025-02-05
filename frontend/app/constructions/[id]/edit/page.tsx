"use client";

import EditConstruction from '@/app/components/features/constructions/EditConstruction';

type Props = {
  params: {
    id: string;
  };
};

export default function EditConstructionPage({ params }: Props) {
  return <EditConstruction constructionId={params.id} />;
} 