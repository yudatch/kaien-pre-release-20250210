import { Contact, Timestamps, UserReference } from '../common';

export interface Customer extends Timestamps, UserReference {
  id: string;
  code: string;
  name: string;
  nameKana: string;
  companyName?: string;
  address: string;
  postalCode?: string;
  phone: string;
  email: string;
  taxId?: string;
  paymentTerms?: number;
  paymentDueDays?: number;
  status: 'active' | 'inactive';
  contacts?: Contact[];
}

export interface CustomerFormData extends Omit<Customer, 'id' | 'contacts' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> {
  contacts?: Contact[];
}

export interface CustomerSummary {
  /** 総顧客数 */
  totalCustomers: number;
  /** 今月の新規顧客数 */
  newCustomersThisMonth: number;
  /** 進行中の案件数 */
  activeProjects: number;
  /** 最近のコンタクト履歴 */
  recentContacts: Contact[];
} 