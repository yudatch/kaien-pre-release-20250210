export enum ProjectStatus {
  DRAFT = 'draft',
  PROPOSAL = 'proposal',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  WON = 'won',
  LOST = 'lost'
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: '下書き',
  [ProjectStatus.PROPOSAL]: '提案中',
  [ProjectStatus.IN_PROGRESS]: '進行中',
  [ProjectStatus.COMPLETED]: '完了',
  [ProjectStatus.CANCELLED]: 'キャンセル',
  [ProjectStatus.WON]: '受注',
  [ProjectStatus.LOST]: '失注'
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: 'default',
  [ProjectStatus.PROPOSAL]: 'primary',
  [ProjectStatus.IN_PROGRESS]: 'info',
  [ProjectStatus.COMPLETED]: 'success',
  [ProjectStatus.CANCELLED]: 'error',
  [ProjectStatus.WON]: 'success',
  [ProjectStatus.LOST]: 'error'
};

export interface Project {
  project_id: number;
  project_code: string;
  customer_id: number;
  project_name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  expected_completion_date?: string;
  status: ProjectStatus;
  total_amount?: number;
  contract_amount?: number;
  profit_margin?: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  Customer?: {
    name: string;
  };
  contact_histories?: ContactHistory[];
}

export type CreateProjectData = Omit<Project, 
  'project_id' | 
  'project_code' | 
  'created_at' | 
  'updated_at' | 
  'created_by' | 
  'updated_by' | 
  'Customer'
>;

export interface ContactHistory {
  contact_date: string;
  contact_time: string;
  contact_method: string;
  contact_person: string;
  contact_content: string;
}

export interface ProjectFormData {
  project_code: string;
  customer_id: number | undefined;
  project_name: string;
  description?: string;
  start_date: string;
  end_date: string;
  expected_completion_date: string;
  sales_rep?: string;
  status: ProjectStatus;
  contract_amount?: number;
  contact_histories: ContactHistory[];
} 