import { ReactNode } from 'react';

export interface Column<T> {
  field: string;
  headerName: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  renderCell?: (params: { row: T }) => React.ReactNode;
  valueGetter?: (params: { row: T }) => string | number;
}

export interface Action<T> {
  icon?: React.ReactNode;
  tooltip?: string;
  onClick: (row: T) => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  show?: (row: T) => boolean;
  label?: string;
  variant?: 'text' | 'outlined' | 'contained';
}

export interface CustomTableStyle {
  elevation?: number;
  border?: string;
  borderRadius?: number;
}

export interface CustomButtonGroupStyle {
  borderColor?: string;
  color?: string;
  hoverBorderColor?: string;
  hoverBackgroundColor?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => number | string;
  actions?: Action<T>[];
  hideActions?: boolean;
  rowsPerPage?: number;
  page?: number;
  totalRows?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onDeleteConfirm?: () => void;
  onDeleteCancel?: () => void;
  deleteDialogOpen?: boolean;
  deleteDialogTitle?: string;
  deleteDialogMessage?: string;
  customTableStyle?: CustomTableStyle;
  customButtonGroupStyle?: CustomButtonGroupStyle;
  useButtonGroup?: boolean;
} 