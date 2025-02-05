export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type DeliveryStatus = 'pending' | 'partial' | 'complete' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'cash';
export type PurchaseStatus = 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';
export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'manager' | 'staff';
export type ConstructionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

// ENUMの値を配列として定義
export const APPROVAL_STATUSES: ApprovalStatus[] = ['pending', 'approved', 'rejected'];
export const DELIVERY_STATUSES: DeliveryStatus[] = ['pending', 'partial', 'complete', 'cancelled'];
export const PAYMENT_METHODS: PaymentMethod[] = ['bank_transfer', 'credit_card', 'cash'];
export const PURCHASE_STATUSES: PurchaseStatus[] = ['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'];
export const QUOTATION_STATUSES: QuotationStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'expired'];
export const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'issued', 'paid', 'cancelled', 'overdue'];
export const PROJECT_STATUSES: ProjectStatus[] = ['draft', 'in_progress', 'completed', 'cancelled'];
export const USER_ROLES: UserRole[] = ['admin', 'manager', 'staff'];
export const CONSTRUCTION_STATUSES: ConstructionStatus[] = ['planned', 'in_progress', 'completed', 'cancelled']; 