export const PURCHASE_STATUS_OPTIONS = [
  { value: '発注待ち', label: '発注待ち' },
  { value: '発注済', label: '発注済' },
  { value: '納品済', label: '納品済' },
  { value: 'キャンセル', label: 'キャンセル' },
] as const;

export type PurchaseStatus = typeof PURCHASE_STATUS_OPTIONS[number]['value'];

export const APPROVAL_STATUS_OPTIONS = [
  { value: 'pending', label: '承認待ち' },
  { value: 'approved', label: '承認済み' },
  { value: 'rejected', label: '却下' },
] as const;

export type ApprovalStatus = typeof APPROVAL_STATUS_OPTIONS[number]['value']; 