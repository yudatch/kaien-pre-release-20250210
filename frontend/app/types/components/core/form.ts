import { Column } from '@/app/types/components/table';

export interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableBodySkeletonProps {
  columns: Column[];
  rows?: number;
} 