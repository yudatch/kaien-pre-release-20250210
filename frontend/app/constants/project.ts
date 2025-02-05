export const statusColors = {
  draft: 'default',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error'
} as const;

export const statusLabels = {
  draft: '下書き',
  in_progress: '進行中',
  completed: '完了',
  cancelled: 'キャンセル'
} as const;

export type ProjectStatus = keyof typeof statusLabels; 