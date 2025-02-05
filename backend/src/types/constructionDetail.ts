import { ConstructionStatus } from './enums';

export interface ConstructionDetailInput {
  project_id: number;
  contractor_id: number;
  construction_date?: Date;
  completion_date?: Date;
  unit_price?: number;
  progress?: number;
  status?: ConstructionStatus;
  notes?: string;
  created_by?: number;
  updated_by?: number;
}

export interface ConstructionDetail extends ConstructionDetailInput {
  construction_id: number;
  created_at: Date;
  updated_at: Date;
}