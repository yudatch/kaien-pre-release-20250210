export interface Expense {
  expense_id: number;
  expense_number: string;
  invoice_number?: string;
  applicant_id: number;
  department: string;
  expense_date: string;
  receipt_date: string;
  amount: string | number;
  category: string;
  payment_method: 'bank_transfer' | 'credit_card' | 'cash' | 'cashless';
  description: string;
  receipt_image_url?: string;
  status: 'draft' | '申請中' | '承認済' | '否認' | '精算済';
  purpose: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  ExpenseApplicant?: {
    user_id: number;
    username: string;
    email: string;
  };
  Approvals?: Array<{
    approval_id: number;
    expense_id: number;
    approver_id: number;
    status: string;
    comment?: string;
    approved_at: string;
    Approver: {
      user_id: number;
      username: string;
      email: string;
    };
  }>;
}

export interface CreateExpenseRequest {
  expense_date: string;
  receipt_date: string;
  invoice_number?: string;
  category: string;
  amount: number;
  payment_method: 'bank_transfer' | 'credit_card' | 'cash' | 'cashless';
  description: string;
  purpose: string;
  receipt_image?: File;
}

export interface UpdateExpenseRequest {
  id: number;
  expense_date?: string;
  receipt_date?: string;
  invoice_number?: string;
  category: string;
  amount: number;
  payment_method: 'bank_transfer' | 'credit_card' | 'cash' | 'cashless';
  description: string;
  purpose: string;
  receipt_image?: File | null;
  receipt_image_url?: string | null;
}

export interface ExpenseResponse {
  data: Expense;
  message?: string;
  success?: boolean;
}

export interface ExpenseListResponse {
  expenses: Expense[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApproveExpenseRequest {
  id: number;
  comment?: string;
}

export interface RejectExpenseRequest {
  id: number;
  reason: string;
} 