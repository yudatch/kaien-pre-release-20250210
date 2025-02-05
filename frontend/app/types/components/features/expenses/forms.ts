import { ExpenseCategory, PaymentMethod } from '@/app/types/common';
import { Dayjs } from 'dayjs';

export interface UploadProgressEvent {
  loaded: number;
  total?: number;
}

export interface UploadOptions {
  onUploadProgress?: (progressEvent: UploadProgressEvent) => void;
}

// 後方互換性のための型
interface LegacyFormData {
  date?: Dayjs | null;
  paymentMethod?: PaymentMethod;
}

export interface ExpenseFormData {
  expense_date: Dayjs | null;
  receipt_date: Dayjs | null;
  invoice_number?: string;
  category: ExpenseCategory;
  amount: string | number;
  payment_method: PaymentMethod;
  description: string;
  purpose: string;
  receipt_image: File | null;
  receipt_image_url?: string | null;
}

export interface ExpenseApiData {
  id?: number;
  expense_date: string;
  receipt_date: string;
  invoice_number?: string;
  category: string;
  amount: number;
  payment_method: string;
  description: string;
  purpose: string;
  receipt_image: File | null;
  receipt_image_url?: string | null;
}

export interface ExpenseFormProps {
  mode?: 'create' | 'edit' | 'view';
  initialData?: Partial<ExpenseFormData & LegacyFormData> & { expense_id?: number };
  onSubmit?: (data: ExpenseApiData, options?: UploadOptions) => Promise<void>;
  onCancel?: () => void;
} 