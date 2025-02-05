import { Dayjs } from 'dayjs';

export interface Supplier {
  id: string;
  name: string;
}

export interface PurchaseFormState {
  date: Dayjs;
  supplierId: string;
  itemName: string;
  quantity: string;
  unitPrice: string;
  status: string;
  notes: string;
}

export const PURCHASE_STATUS_OPTIONS = [
  { value: '発注待ち', label: '発注待ち' },
  { value: '発注済み', label: '発注済み' },
  { value: '入荷済み', label: '入荷済み' },
  { value: 'キャンセル', label: 'キャンセル' },
] as const;

export type PurchaseStatus = typeof PURCHASE_STATUS_OPTIONS[number]['value']; 