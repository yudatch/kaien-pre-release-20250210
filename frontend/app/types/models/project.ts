import { ProjectStatus } from '@/app/constants/project';

export type ConstructionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
  project_id: number;
  project_code: string;
  project_name: string;
  status: string;
  Customer?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData extends Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'customer' | 'salesRep' | 'quotations'> {}

export interface ProjectSummary {
  totalProjects: number;
  projectsByStatus: {
    draft: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  recentQuotations: Array<{
    projectName: string;
    amount: number;
    status: string;
  }>;
} 