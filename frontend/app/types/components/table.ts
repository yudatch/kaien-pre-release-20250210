export type Column = {
  id?: string;
  label: string;
  field: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  headerName?: string;
}; 