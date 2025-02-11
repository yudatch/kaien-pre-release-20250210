import { Customer } from '@/app/types/customer';
import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent } from 'react';
import { PaymentTerms, PaymentDueDays } from '@/app/constants/payment';
import dayjs from 'dayjs';

export interface CustomerFormData {
  customer_code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  postal_code: string;
  tax_id: string;
  payment_terms: 1 | 2 | 3 | 4 | 5 | null;
  payment_due_days: 0 | 30 | 60 | 90 | null;
  notes: string;
  is_active: boolean;
}

export interface FormTextFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  variant?: 'standard' | 'outlined' | 'filled';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  InputProps?: object;
}

export interface FormSelectFieldProps {
  label: string;
  value: string | number;
  onChange: (e: SelectChangeEvent<string | number>) => void;
  options: { readonly value: string | number; readonly label: string; }[] | readonly { readonly value: string | number; readonly label: string; }[];
  required?: boolean;
  disabled?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
}

export interface FormActionsProps {
  onSave: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  mode?: 'view' | 'edit' | 'create';
}

export const STATUS_OPTIONS = [
  { value: 'true', label: '有効' },
  { value: 'false', label: '無効' },
];

export interface ContactFormData {
  customerName: string;
  contactDate: dayjs.Dayjs;
  contactType: '訪問' | '電話' | 'メール';
  staff: string;
  description: string;
  status: '未対応' | '対応中' | '完了';
}  