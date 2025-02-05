import { PurchaseOrder } from '@/app/types/purchase';
import type { Column } from '@/app/types/table';

export interface TableComponentsProps {
  columns: Column[];
  data: PurchaseOrder[];
  onRowClick: (purchase: PurchaseOrder) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, purchase: PurchaseOrder) => void;
} 