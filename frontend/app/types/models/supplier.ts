export interface Supplier {
  id: string;
  code: string;
  name: string;
  nameKana: string;
  address: string;
  postalCode?: string;
  phone: string;
  email: string;
  taxId?: string;
  paymentTerms?: number;
  paymentDueDays?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface SupplierFormData extends Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> {} 