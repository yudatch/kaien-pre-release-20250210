import { ExpenseCategory, PaymentMethod } from '@/app/types/common';

interface Option<T> {
  value: T;
  label: string;
}

export const EXPENSE_CATEGORIES: Option<ExpenseCategory>[] = [
  { value: 'transportation', label: '交通費' },
  { value: 'meals', label: '飲食費' },
  { value: 'supplies', label: '備品・消耗品' },
  { value: 'books', label: '書籍・資料代' },
  { value: 'others', label: 'その他' }
];

export const PAYMENT_METHODS: Option<PaymentMethod>[] = [
  { value: 'cash', label: '現金' },
  { value: 'credit_card', label: 'クレジットカード' },
  { value: 'bank_transfer', label: '銀行振込' },
  { value: 'cashless', label: 'キャッシュレス' }
];

export const EXPENSE_CATEGORY_LABELS: { [key: string]: string } = {
  transportation: '交通費',
  meals: '飲食費',
  supplies: '消耗品費',
  books: '書籍費',
  others: 'その他'
};

export const PAYMENT_METHOD_LABELS: { [key: string]: string } = {
  cash: '現金',
  credit_card: 'クレジットカード',
  bank_transfer: '銀行振込',
  cashless: 'キャッシュレス'
}; 