export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';
export type ConstructionStatus = '計画中' | '進行中' | '完了' | '中止';

export interface StatusCounts {
  draft: number;
  in_progress: number;
  completed: number;
  cancelled: number;
} 