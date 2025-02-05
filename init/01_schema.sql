\c postgres;

DROP DATABASE IF EXISTS accounting_software_db;
CREATE DATABASE accounting_software_db;

\c accounting_software_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMタイプの定義
CREATE TYPE project_status AS ENUM ('draft', 'proposal', 'in_progress', 'completed', 'cancelled', 'won', 'lost');
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'cancelled', 'overdue');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'credit_card', 'cash', 'cashless');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE quotation_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
CREATE TYPE purchase_status AS ENUM ('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled');
CREATE TYPE construction_status AS ENUM (
    'planned',
    'in_progress',
    'completed',
    'cancelled'
);
CREATE TYPE expense_status AS ENUM ('draft', '申請中', '承認済', '否認', '精算済');
CREATE TYPE expense_category AS ENUM ('transportation', 'meals', 'supplies', 'books', 'others');

-- 権限テーブル
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ロールと権限の関連付けテーブル
CREATE TABLE role_permissions (
    role_permission_id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    permission_id INTEGER REFERENCES permissions(permission_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role, permission_id)
);

-- ENUMタイプの作成を条件付きで行う
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff');
    END IF;
END
$$;

-- テーブル作成
-- ユーザーテーブル
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 顧客テーブル
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(8),
    tax_id VARCHAR(13),
    payment_terms INTEGER,
    payment_due_days INTEGER,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 仕入先テーブル
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(8),
    tax_id VARCHAR(13),
    payment_terms INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 商品マスタテーブル
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    cost DECIMAL(12,2),
    category VARCHAR(50),
    current_stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 10.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 案件テーブル
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_code VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(customer_id),
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    expected_completion_date DATE,
    sales_rep INTEGER REFERENCES users(user_id),
    status project_status DEFAULT 'draft',
    total_amount DECIMAL(12,2),
    contract_amount DECIMAL(12,2),
    profit_margin DECIMAL(5,2),
    construction_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 見積書テーブル
CREATE TABLE quotations (
    quotation_id SERIAL PRIMARY KEY,
    quotation_number VARCHAR(20) UNIQUE NOT NULL,
    project_id INTEGER REFERENCES projects(project_id),
    issue_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status quotation_status DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 見積書明細テーブル
CREATE TABLE quotation_details (
    detail_id SERIAL PRIMARY KEY,
    quotation_id INTEGER REFERENCES quotations(quotation_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id),
    description TEXT,
    quantity INTEGER NOT NULL,
    unit VARCHAR(10) NOT NULL DEFAULT '個',
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
);

-- 請求書テーブル
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    project_id INTEGER REFERENCES projects(project_id),
    quotation_id INTEGER,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status invoice_status DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 請求書明細テーブル
CREATE TABLE invoice_details (
    detail_id SERIAL PRIMARY KEY,
    invoice_id INTEGER,
    product_id INTEGER REFERENCES products(product_id),
    description TEXT,
    quantity INTEGER NOT NULL,
    unit VARCHAR(10) NOT NULL DEFAULT '個',
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
);

-- 入金テーブル
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(invoice_id),
    payment_date DATE NOT NULL,
    amount_received DECIMAL(12,2) NOT NULL,
    payment_method payment_method NOT NULL,
    reference_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 仕入テーブル
CREATE TABLE purchases (
    purchase_id SERIAL PRIMARY KEY,
    purchase_number VARCHAR(20) UNIQUE NOT NULL,
    project_id INTEGER REFERENCES projects(project_id),
    supplier_id INTEGER REFERENCES suppliers(supplier_id),
    order_date DATE NOT NULL,
    delivery_date DATE,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status purchase_status DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 仕入明細テーブル
CREATE TABLE purchase_details (
    detail_id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(purchase_id),
    product_id INTEGER REFERENCES products(product_id),
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
);

-- インデックスの作成
CREATE INDEX idx_customer_name ON customers(name);
CREATE INDEX idx_customer_code ON customers(customer_code);
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_project_customer ON projects(customer_id);
CREATE INDEX idx_invoice_status ON invoices(status);
CREATE INDEX idx_invoice_dates ON invoices(issue_date, due_date);
CREATE INDEX idx_payment_date ON payments(payment_date);
CREATE INDEX idx_supplier_name ON suppliers(name);
CREATE INDEX idx_product_code ON products(product_code);

-- updated_at自動更新用の関数とトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_customer_modtime
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_modtime
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_modtime
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotation_modtime
    BEFORE UPDATE ON quotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_modtime
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_modtime
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_modtime
    BEFORE UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 新規追加テーブル
-- コンタクト履歴テーブル
CREATE TABLE contact_histories (
    contact_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    contact_date TIMESTAMP NOT NULL,
    contact_method VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
);

-- 工事情報テーブル
CREATE TABLE construction_details (
    construction_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id) NOT NULL,
    contractor_id INTEGER REFERENCES suppliers(supplier_id) NOT NULL,
    construction_date DATE,
    completion_date DATE,
    unit_price DECIMAL(12,2),
    progress INTEGER DEFAULT 0,
    status construction_status DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id)
);

-- インデックスの作成
CREATE INDEX idx_contact_customer ON contact_histories(customer_id);
CREATE INDEX idx_contact_date ON contact_histories(contact_date);
CREATE INDEX idx_construction_project ON construction_details(project_id);
CREATE INDEX idx_construction_date ON construction_details(construction_date);

-- トリガーの作成
CREATE TRIGGER update_contact_history_modtime
    BEFORE UPDATE ON contact_histories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_construction_modtime
    BEFORE UPDATE ON construction_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 印鑑情報テーブル
CREATE TABLE seals (
    seal_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    seal_image_path VARCHAR(255) NOT NULL,
    seal_type VARCHAR(20) NOT NULL, -- 'personal', 'company' など
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文書承認ワークフローテーブル
CREATE TABLE approval_workflows (
    workflow_id SERIAL PRIMARY KEY,
    document_type VARCHAR(20) NOT NULL, -- 'quotation', 'purchase_order' など
    document_id INTEGER NOT NULL,
    approver_id INTEGER REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'pending',
    approved_at TIMESTAMP,
    seal_id INTEGER REFERENCES seals(seal_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE postal_codes (
    postal_code VARCHAR(8) PRIMARY KEY,
    prefecture VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL,
    town VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商材カテゴリテーブル
CREATE TABLE product_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 10.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- productsテーブルに追加するカラム
ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES product_categories(category_id);

-- 案件収支テーブル
CREATE TABLE project_finances (
    finance_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id),
    estimated_revenue DECIMAL(12,2),
    actual_revenue DECIMAL(12,2),
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    profit_loss DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工事マスタテーブル
CREATE TABLE construction_master (
    construction_type_id SERIAL PRIMARY KEY,
    construction_type VARCHAR(50) NOT NULL,
    standard_unit_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 仕入先支払管理テーブル
CREATE TABLE supplier_payments (
    payment_id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(purchase_id),
    payment_date DATE NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL,
    payment_method payment_method NOT NULL,
    reference_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 文書変換履歴テーブル
CREATE TABLE document_conversions (
    conversion_id SERIAL PRIMARY KEY,
    source_type VARCHAR(20) NOT NULL,
    source_id INTEGER NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    target_id INTEGER NOT NULL,
    converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_by INTEGER REFERENCES users(user_id),
    notes TEXT
);

-- インデックスの追加
CREATE INDEX idx_supplier_payment_date ON supplier_payments(payment_date);
CREATE INDEX idx_construction_type ON construction_master(construction_type);
CREATE INDEX idx_document_conversion_source ON document_conversions(source_type, source_id);

-- トリガーの追加
CREATE TRIGGER update_construction_master_modtime
    BEFORE UPDATE ON construction_master
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_payments_modtime
    BEFORE UPDATE ON supplier_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 発注書テーブル
CREATE TABLE purchase_orders (
    order_id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(supplier_id),
    project_id INTEGER REFERENCES projects(project_id),
    order_date DATE NOT NULL,
    delivery_date DATE,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status purchase_status DEFAULT 'draft',
    approval_status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(user_id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 発注書明細テーブル
CREATE TABLE purchase_order_details (
    detail_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES purchase_orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    delivery_status VARCHAR(20) DEFAULT 'pending',
    received_quantity INTEGER DEFAULT 0,
    received_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
);

-- インデックスの作成
CREATE INDEX idx_purchase_order_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_order_status ON purchase_orders(status);
CREATE INDEX idx_purchase_order_approval ON purchase_orders(approval_status);

-- トリガーの作成
CREATE TRIGGER update_purchase_order_modtime
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 経費テーブル
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    expense_number VARCHAR(20) UNIQUE NOT NULL,
    invoice_number VARCHAR(50),
    applicant_id INTEGER REFERENCES users(user_id) NOT NULL,
    department VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    receipt_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    category expense_category NOT NULL,
    payment_method payment_method NOT NULL,
    description TEXT,
    purpose TEXT NOT NULL,
    receipt_image_url TEXT,
    status expense_status DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- 経費承認履歴テーブル
CREATE TABLE expense_approvals (
    approval_id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(expense_id) ON DELETE CASCADE,
    approver_id INTEGER REFERENCES users(user_id) NOT NULL,
    status expense_status NOT NULL,
    comment TEXT,
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_expense_number ON expenses(expense_number);
CREATE INDEX idx_expense_applicant ON expenses(applicant_id);
CREATE INDEX idx_expense_status ON expenses(status);
CREATE INDEX idx_expense_date ON expenses(expense_date);
CREATE INDEX idx_expense_approval_expense ON expense_approvals(expense_id);

-- トリガーの作成
CREATE TRIGGER update_expense_modtime
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_approval_modtime
    BEFORE UPDATE ON expense_approvals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 案件コンタクト履歴テーブル
CREATE TABLE project_contact_histories (
    contact_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
    contact_date DATE NOT NULL,
    contact_time TIME NOT NULL,
    contact_method VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    contact_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id)
);

-- インデックスの追加
CREATE INDEX idx_project_contact_date ON project_contact_histories(contact_date);
CREATE INDEX idx_project_contact_project ON project_contact_histories(project_id);

-- トリガーの追加
CREATE TRIGGER update_project_contact_history_modtime
    BEFORE UPDATE ON project_contact_histories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();