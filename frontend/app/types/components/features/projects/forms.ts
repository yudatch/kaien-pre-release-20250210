import { Customer } from '@/app/types/customer';
import { ProjectStatus, ContactHistory } from '@/app/types/project';

export interface FormTextFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  type?: string;
  InputProps?: {
    readOnly?: boolean;
    disableUnderline?: boolean;
    sx?: any;
  };
  InputLabelProps?: {
    shrink?: boolean;
    sx?: {
      position?: string;
      transform?: string;
      marginBottom?: string;
    };
  };
}

export interface FormSelectFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: { value: any; label: string; }[];
  required?: boolean;
  disabled?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  InputProps?: {
    readOnly?: boolean;
    disableUnderline?: boolean;
    sx?: any;
  };
}

export interface FormDateFieldProps {
  label: string;
  value: any;
  onChange: (value: string | null) => void;
  required?: boolean;
  disabled?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  InputProps?: {
    readOnly?: boolean;
    disableUnderline?: boolean;
    sx?: any;
  };
}

export interface FormMoneyFieldProps {
  label: string;
  value: any;
  onChange: (value: number | null) => void;
  required?: boolean;
  disabled?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  InputProps?: {
    readOnly?: boolean;
    disableUnderline?: boolean;
    sx?: any;
  };
}

export interface ProjectFormData {
  project_code: string;
  customer_id: number | undefined;
  project_name: string;
  description?: string;
  start_date: string;
  end_date: string;
  expected_completion_date: string;
  sales_rep?: string;
  status: ProjectStatus;
  contract_amount?: number;
  contact_histories: ContactHistory[];
} 