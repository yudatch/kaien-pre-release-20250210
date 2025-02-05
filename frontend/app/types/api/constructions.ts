import { ConstructionStatus } from '../common/status';
import { BaseProjectResponse, BaseCreateProjectRequest, BaseUpdateProjectRequest } from '../common/project';

export type Construction = BaseProjectResponse & {
  status: ConstructionStatus;
};

export type CreateConstructionRequest = BaseCreateProjectRequest<ConstructionStatus>;
export type UpdateConstructionRequest = BaseUpdateProjectRequest<ConstructionStatus>;

export type ConstructionResponse = {
  construction: Construction;
};

export type ConstructionsResponse = {
  constructions: Construction[];
};

export type ConstructionDetailStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export type Project = {
  project_id: number;
  project_name: string;
  project_code: string;
};

export type Contractor = {
  supplier_id: number;
  name: string;
};

export type Creator = {
  user_id: number;
  username: string;
} | null;

export type ConstructionDetail = {
  construction_id: number;
  project_id: number;
  contractor_id: number;
  construction_date: string;
  completion_date: string | null;
  unit_price: string;
  status: ConstructionDetailStatus;
  notes: string | null;
  progress: number;
  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
  Project: Project;
  Contractor: Contractor;
  Creator: Creator;
};

export type CreateConstructionDetailRequest = {
  project_id: number;
  contractor_id: number;
  construction_date: string | null;
  completion_date: string | null;
  unit_price: number;
  status: ConstructionDetailStatus;
  notes: string;
  progress: number;
};

export type UpdateConstructionDetailRequest = CreateConstructionDetailRequest;

export type ConstructionDetailsResponse = {
  success: boolean;
  message?: string;
  data: ConstructionDetail[];
};

export type ConstructionDetailResponse = {
  success: boolean;
  message?: string;
  data: ConstructionDetail;
}; 