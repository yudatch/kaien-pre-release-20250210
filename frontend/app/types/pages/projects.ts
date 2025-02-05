import { ProjectStatus } from '../project';

type StatusColor = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export const statusColors: Record<ProjectStatus, StatusColor> = {
  draft: 'default',
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
  completed: 'info',
  cancelled: 'error',
} as const;

export const statusLabels: Record<ProjectStatus, string> = {
  draft: '下書き',
  pending: '申請中',
  accepted: '受注',
  rejected: '失注',
  completed: '完了',
  cancelled: 'キャンセル',
} as const;

export type ProjectStatus = keyof typeof statusLabels; 