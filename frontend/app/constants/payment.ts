export const PAYMENT_TERMS_OPTIONS = [
  { value: 1, label: '即時払い' },
  { value: 2, label: '月末締め' },
  { value: 3, label: '15日締め' },
  { value: 4, label: '30日締め' },
  { value: 5, label: '60日締め' },
] as const;

export type PaymentTerms = typeof PAYMENT_TERMS_OPTIONS[number]['value'];

export const PAYMENT_DUE_DAYS_OPTIONS = [
  { value: 0, label: '当日' },
  { value: 30, label: '30日' },
  { value: 60, label: '60日' },
  { value: 90, label: '90日' },
] as const;

export type PaymentDueDays = typeof PAYMENT_DUE_DAYS_OPTIONS[number]['value']; 