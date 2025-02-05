import { PaymentTerms, PaymentDueDays } from '@/app/constants/payment';

export interface Customer {
  customer_id: number;
  customer_code: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  tax_id: string | null;
  payment_terms: PaymentTerms | null;
  payment_due_days: PaymentDueDays | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
}

export interface CreateCustomerData {
  name: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  postal_code?: string | null;
  tax_id?: string | null;
  payment_terms?: PaymentTerms | null;
  payment_due_days?: PaymentDueDays | null;
  notes?: string | null;
  is_active?: boolean;
} 