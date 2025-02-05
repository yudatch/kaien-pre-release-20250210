"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 案件の型定義
interface Project {
  project_id: number;
  project_code: string;
  project_name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  contract_amount: number;
  Customer?: {
    name: string;
  };
}

export default function ProjectsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/projects/list');
  }, [router]);

  return null;
} 