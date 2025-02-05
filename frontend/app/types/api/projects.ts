import { Project } from '../models/project';
import { ProjectStatus, StatusCounts } from '../common/status';
import { BaseResponse, BaseCreateRequest, BaseUpdateRequest } from '../common/api';

export interface ProjectSummary {
  totalProjects: number;
  projectsByStatus: StatusCounts;
  recentQuotations: Array<{
    project_name: string;
    amount: number;
    status: string;
  }>;
}

export type ProjectListResponse = BaseResponse<Project>;
export type CreateProjectRequest = BaseCreateRequest<Project>;
export type UpdateProjectRequest = BaseUpdateRequest<Project>;

export interface ContactHistory {
  contact_date: string;
  contact_time: string;
  contact_method: string;
  contact_person: string;
  contact_content: string;
}

export interface CreateProjectData {
  project_name: string;
  customer_id: number;
  description?: string;
  start_date?: string;
  end_date?: string;
  expected_completion_date?: string;
  status: ProjectStatus;
  contract_amount?: number;
  contact_histories?: ContactHistory[];
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  project_id: number;
}

export interface ProjectResponse {
  success: boolean;
  data: {
    project_id: number;
    project_code: string;
    project_name: string;
    customer_id: number;
    description?: string;
    start_date?: string;
    end_date?: string;
    expected_completion_date?: string;
    status: ProjectStatus;
    contract_amount?: number;
    contact_histories?: ContactHistory[];
    created_at: string;
    updated_at: string;
  };
  message?: string;
} 