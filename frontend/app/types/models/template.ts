import { BaseModel } from '../common/model';

export interface Template extends BaseModel {
  name: string;
  content: string;
  type: 'invoice' | 'quotation';
  isDefault: boolean;
} 