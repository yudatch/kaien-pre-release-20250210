import { Dayjs } from 'dayjs';

export interface Customer {
  id: string;
  name: string;
}

export interface ConstructionFormData {
  name: string;
  customerId: string;
  location: string;
  startDate: Dayjs;
  endDate: Dayjs;
  budget: string;
  status: string;
  description: string;
  manager: string;
} 