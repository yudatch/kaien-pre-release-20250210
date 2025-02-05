import { ReactNode } from 'react';

export interface FormActionsProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface BaseFormProps<T> {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export interface FormErrors {
  [key: string]: string[];
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: { [K in keyof T]?: boolean };
  isSubmitting: boolean;
  isValid: boolean;
} 