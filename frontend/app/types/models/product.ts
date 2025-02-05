export interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  category: string | null;
  currentStock: number;
  minimumStock: number;
  taxRate: number;
  isActive: boolean;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> {} 