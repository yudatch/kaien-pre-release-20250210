export enum ProjectStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  WON = 'won',
  LOST = 'lost'
}

export interface ProjectInput {
  project_code?: string;
  customer_id: number;
  project_name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  expected_completion_date?: Date;
  status?: ProjectStatus;
  total_amount?: number;
  contract_amount?: number;
  profit_margin?: number;
  construction_status?: string;
  created_by?: number;
  updated_by?: number;
  contact_histories?: Array<{
    contact_date: string;
    contact_time: string;
    contact_method: string;
    contact_person: string;
    contact_content: string;
  }>;
}

export interface Project extends ProjectInput {
  project_id: number;
  created_at: Date;
  updated_at: Date;
}

export type CreateProjectData = Omit<ProjectInput, 'project_id'>;