import { ProjectStatus, ConstructionStatus } from './status';

export interface BaseProject {
  name: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface BaseProjectResponse extends BaseProject {
  id: string;
  customerName: string;
}

export type BaseCreateProjectRequest<T extends ProjectStatus | ConstructionStatus> = BaseProject & {
  status: T;
};

export type BaseUpdateProjectRequest<T extends ProjectStatus | ConstructionStatus> = Partial<BaseCreateProjectRequest<T>>; 