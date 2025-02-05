import { Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Customer from './Customer';
import Project from './Project';
import Product from './Product';
import ConstructionDetail from './ConstructionDetail';
import Quotation from './Quotation';
import ContactHistory from './ContactHistory';
import Purchase from './Purchase';
import QuotationDetail from './QuotationDetail';
import Invoice from './Invoice';
import InvoiceDetail from './InvoiceDetail';
import Supplier from './Supplier';
import PurchaseOrder from './PurchaseOrder';
import PurchaseOrderDetail from './PurchaseOrderDetail';
import SupplierPayment from './SupplierPayment';
import ApprovalWorkflow from './ApprovalWorkflow';
import Seal from './Seal';
import ProductCategory from './ProductCategory';
import PurchaseDetail from './PurchaseDetail';
import Expense from './Expense';
import ExpenseApproval from './ExpenseApproval';
import Permission from './Permission';
import RolePermission from './RolePermission';
import ProjectContactHistory from './ProjectContactHistory';

// モデルをエクスポート
export {
  User,
  Customer,
  Project,
  Product,
  ConstructionDetail,
  Quotation,
  ContactHistory,
  Purchase,
  QuotationDetail,
  Invoice,
  InvoiceDetail,
  Supplier,
  PurchaseOrder,
  PurchaseOrderDetail,
  SupplierPayment,
  ApprovalWorkflow,
  Seal,
  ProductCategory,
  PurchaseDetail,
  Expense,
  ExpenseApproval,
  Permission,
  RolePermission,
  ProjectContactHistory,
};

/**
 * データベースモデル間のリレーション（関連）設定
 * 
 * @description
 * - Customer(1) - Project(多)
 * - Project(1) - Quotation(多)
 * - Project(1) - ConstructionDetail(多)
 * - Customer(1) - ContactHistory(多)
 * 
 * @example
 * // 顧客と関連する案件を取得する例
 * const customer = await Customer.findOne({
 *   include: [{ model: Project }]
 * });
 */

// 顧客と案件の関連
Customer.hasMany(Project, {
  foreignKey: 'customer_id',
  as: 'Projects'
});

Project.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'Customer'
});

Project.hasMany(Quotation, { foreignKey: 'project_id' });
Quotation.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasMany(ConstructionDetail, { 
  foreignKey: 'project_id',
  as: 'Constructions'
});

ConstructionDetail.belongsTo(Project, { 
  foreignKey: 'project_id',
  as: 'Project'
});

// 工事詳細と業者の関連
ConstructionDetail.belongsTo(Supplier, {
  foreignKey: 'contractor_id',
  as: 'Contractor'
});

Supplier.hasMany(ConstructionDetail, {
  foreignKey: 'contractor_id',
  as: 'Constructions'
});

// 工事詳細の作成者・更新者の関連
User.hasMany(ConstructionDetail, {
  foreignKey: 'created_by',
  as: 'CreatedConstructions'
});

User.hasMany(ConstructionDetail, {
  foreignKey: 'updated_by',
  as: 'UpdatedConstructions'
});

ConstructionDetail.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'ConstructionCreator'
});

ConstructionDetail.belongsTo(User, {
  foreignKey: 'updated_by',
  as: 'ConstructionUpdater'
});

Customer.hasMany(ContactHistory, { foreignKey: 'customer_id' });
ContactHistory.belongsTo(Customer, { foreignKey: 'customer_id' });

// 見積書と請求書の関連を設定
Quotation.hasMany(QuotationDetail, { foreignKey: 'quotation_id' });
QuotationDetail.belongsTo(Quotation, { foreignKey: 'quotation_id' });
QuotationDetail.belongsTo(Product, { foreignKey: 'product_id' });

Invoice.hasMany(InvoiceDetail, { foreignKey: 'invoice_id' });
InvoiceDetail.belongsTo(Invoice, { foreignKey: 'invoice_id' });
InvoiceDetail.belongsTo(Product, { foreignKey: 'product_id' });

// プロジェクトとの関連
Project.hasMany(Invoice, { 
  foreignKey: 'project_id',
  as: 'Invoices'
});
Invoice.belongsTo(Project, { 
  foreignKey: 'project_id',
  as: 'Project'
});

// 仕入先関連
Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplier_id' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplier_id' });

// 発注書関連
PurchaseOrder.hasMany(PurchaseOrderDetail, { foreignKey: 'order_id' });
PurchaseOrderDetail.belongsTo(PurchaseOrder, { 
  foreignKey: 'order_id',
  as: 'ParentOrder'
});
PurchaseOrderDetail.belongsTo(Product, { foreignKey: 'product_id' });

// 仕入先支払関連
SupplierPayment.belongsTo(PurchaseOrder, { 
  foreignKey: 'order_id',
  as: 'LinkedPurchaseOrder'
});
PurchaseOrder.hasMany(SupplierPayment, { 
  foreignKey: 'order_id',
  as: 'OrderPayments'
});

// 承認ワークフロー関連
User.hasMany(ApprovalWorkflow, { foreignKey: 'approver_id' });
ApprovalWorkflow.belongsTo(User, { foreignKey: 'approver_id' });

// プロジェクトと発注書の関連
Project.hasMany(PurchaseOrder, { foreignKey: 'project_id' });
PurchaseOrder.belongsTo(Project, { foreignKey: 'project_id' });

// 承認者と発注書の関連
User.hasMany(PurchaseOrder, { 
  foreignKey: 'approved_by',
  as: 'ApprovedOrders'
});
PurchaseOrder.belongsTo(User, { 
  foreignKey: 'approved_by',
  as: 'Approver'
});

// 作成者・更新者の関連（共通）
PurchaseOrder.belongsTo(User, { 
  foreignKey: 'created_by',
  as: 'PurchaseOrderCreator'
});
PurchaseOrder.belongsTo(User, { 
  foreignKey: 'updated_by',
  as: 'PurchaseOrderUpdater'
});

// 商品カテゴリーとの関連付けを追加
ProductCategory.hasMany(Product, { 
  foreignKey: 'category_id',
  as: 'CategoryProducts'
});
Product.belongsTo(ProductCategory, { 
  foreignKey: 'category_id',
  as: 'ParentCategory'
});

// 仕入れと案件の関連付けを追加
Project.hasMany(Purchase, { foreignKey: 'project_id' });
Purchase.belongsTo(Project, { foreignKey: 'project_id' });

// 発注書と仕入れの関連付けを統一
PurchaseOrder.hasMany(Purchase, { 
  foreignKey: 'order_id',
  as: 'Purchases'
});

Purchase.belongsTo(PurchaseOrder, { 
  foreignKey: 'order_id',
  as: 'RelatedPurchaseOrder'
});

// 承認ワークフローの関連付けを修正
ApprovalWorkflow.belongsTo(PurchaseOrder, {
  foreignKey: 'document_id',
  constraints: false,
  scope: {
    document_type: 'purchase_order'
  },
  as: 'ApprovedPurchaseOrder'
});

ApprovalWorkflow.belongsTo(Quotation, {
  foreignKey: 'document_id',
  constraints: false,
  scope: {
    document_type: 'quotation'
  },
  as: 'ApprovedQuotation'
});

ApprovalWorkflow.belongsTo(Invoice, {
  foreignKey: 'document_id',
  constraints: false,
  scope: {
    document_type: 'invoice'
  },
  as: 'ApprovedInvoice'
});

// Purchase と PurchaseDetail の関連付け
Purchase.hasMany(PurchaseDetail, { 
  foreignKey: 'purchase_id',
  as: 'PurchaseDetails'
});

PurchaseDetail.belongsTo(Purchase, { 
  foreignKey: 'purchase_id',
  as: 'ParentPurchase'
});

// Supplier と Purchase の関連付け
Supplier.hasMany(Purchase, { foreignKey: 'supplier_id' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplier_id' });

// ユーザーと印鑑の関連付け
User.hasMany(Seal, { 
  foreignKey: 'user_id',
  as: 'UserSeals'
});
Seal.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'SealOwner'
});

// 承認ワークフローと印鑑の関連付け
Seal.hasMany(ApprovalWorkflow, { 
  foreignKey: 'seal_id',
  as: 'ApprovalSeals'
});

ApprovalWorkflow.belongsTo(Seal, { 
  foreignKey: 'seal_id',
  as: 'ApprovalSeal'
});

// 仕入先と仕入先支払の関連付け
Supplier.hasMany(SupplierPayment, {
  foreignKey: 'supplier_id',
  as: 'SupplierPayments'
});

SupplierPayment.belongsTo(Supplier, {
  foreignKey: 'supplier_id',
  as: 'Supplier'
});

// 経費関連のリレーション設定
User.hasMany(Expense, {
  foreignKey: 'applicant_id',
  as: 'SubmittedExpenses'
});

Expense.belongsTo(User, {
  foreignKey: 'applicant_id',
  as: 'ExpenseRequestor'
});

User.hasMany(Expense, {
  foreignKey: 'created_by',
  as: 'CreatedExpenses'
});

User.hasMany(Expense, {
  foreignKey: 'updated_by',
  as: 'UpdatedExpenses'
});

Expense.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'ExpenseCreator'
});

Expense.belongsTo(User, {
  foreignKey: 'updated_by',
  as: 'ExpenseUpdater'
});

Expense.hasMany(ExpenseApproval, {
  foreignKey: 'expense_id',
  as: 'Approvals'
});

ExpenseApproval.belongsTo(Expense, {
  foreignKey: 'expense_id',
  as: 'ApprovedExpense'
});

User.hasMany(ExpenseApproval, {
  foreignKey: 'approver_id',
  as: 'ApprovedExpenseRequests'
});

ExpenseApproval.belongsTo(User, {
  foreignKey: 'approver_id',
  as: 'ExpenseApprovalUser'
});

// 顧客の作成者・更新者の関連
Customer.belongsTo(User, { 
  foreignKey: 'created_by', 
  as: 'CustomerCreator' 
});

Customer.belongsTo(User, { 
  foreignKey: 'updated_by', 
  as: 'CustomerUpdater' 
});

// 見積書の作成者・更新者の関連
Quotation.belongsTo(User, { 
  foreignKey: 'created_by', 
  as: 'QuotationCreator' 
});

Quotation.belongsTo(User, { 
  foreignKey: 'updated_by', 
  as: 'QuotationUpdater' 
});

// 請求書の作成者・更新者の関連
Invoice.belongsTo(User, { 
  foreignKey: 'created_by', 
  as: 'InvoiceCreator' 
});

Invoice.belongsTo(User, { 
  foreignKey: 'updated_by', 
  as: 'InvoiceUpdater' 
});

// 仕入先の作成者・更新者の関連
Supplier.belongsTo(User, { 
  foreignKey: 'created_by', 
  as: 'SupplierCreator' 
});

Supplier.belongsTo(User, { 
  foreignKey: 'updated_by', 
  as: 'SupplierUpdater' 
});

// 権限関連のリレーション設定
Permission.hasMany(RolePermission, {
  foreignKey: 'permission_id',
  as: 'RolePermissions'
});

RolePermission.belongsTo(Permission, {
  foreignKey: 'permission_id',
  as: 'Permission'
});

// プロジェクトとコンタクト履歴の関連付け
Project.hasMany(ProjectContactHistory, {
  foreignKey: 'project_id',
  as: 'contact_histories'
});

ProjectContactHistory.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'Project'
});

// プロジェクトコンタクト履歴とユーザーの関連付け
ProjectContactHistory.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'CreatedBy'
});

ProjectContactHistory.belongsTo(User, {
  foreignKey: 'updated_by',
  as: 'UpdatedBy'
});

export default sequelize;