export interface CustomerInput {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  tax_id?: string;
  payment_terms?: number;
  payment_due_days?: number;
  notes?: string;
  is_active?: boolean;
  created_by?: number;
  updated_by?: number;
} 