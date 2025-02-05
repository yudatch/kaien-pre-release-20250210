\c accounting_software_db;

-- 1. 管理者ユーザーの作成
INSERT INTO users (user_id, username, password_hash, email, role, is_active, created_at, updated_at)
VALUES 
  (1, 'admin', '$2b$10$D8eVV1bQC9ttfnMhTISH0uqQc7RyVqRQW/e4QmAuYNvqdNbwnCCUG', 'admin@example.com', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'manager', '$2b$10$D8eVV1bQC9ttfnMhTISH0uqQc7RyVqRQW/e4QmAuYNvqdNbwnCCUG', 'manager@example.com', 'manager', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. 顧客データ
INSERT INTO customers (
    customer_code, 
    name, 
    contact_person, 
    phone, 
    email, 
    created_by, 
    updated_by
) VALUES
('CUST001', '株式会社ABC', '山田太郎', '03-1234-5678', 'yamada@abc.co.jp', 1, 1),
('CUST002', 'DEF工業', '鈴木一郎', '03-2345-6789', 'suzuki@def.co.jp', 1, 1),
('CUST003', 'GHI建設', '佐藤次郎', '03-3456-7890', 'sato@ghi.co.jp', 1, 1);

-- 3. 仕入先データ
INSERT INTO suppliers (
    supplier_code, 
    name, 
    contact_person, 
    phone, 
    email, 
    address, 
    is_active, 
    created_by, 
    updated_by
) VALUES
('SUP001', '山田建設', '山田太郎', '03-1234-5678', 'yamada@example.com', '東京都新宿区1-1-1', true, 1, 1),
('SUP002', '佐藤工業', '佐藤次郎', '03-2345-6789', 'sato@example.com', '東京都渋谷区2-2-2', true, 1, 1),
('SUP003', '田中電機', '田中三郎', '03-3456-7890', 'tanaka@example.com', '東京都品川区3-3-3', true, 1, 1);

-- 4. 商品データ
INSERT INTO products (
    product_code, 
    name, 
    price, 
    cost, 
    current_stock, 
    minimum_stock, 
    created_by, 
    updated_by
) VALUES
('PRD001', '空調フィルター', 15000, 10000, 5, 10, 1, 1),
('PRD002', 'LED照明器具', 25000, 18000, 8, 15, 1, 1),
('PRD003', '配管部材', 8000, 5000, 12, 20, 1, 1);

-- 5. 案件データ
INSERT INTO projects (
    project_code,
    customer_id,
    project_name,
    description,
    status,
    start_date,
    expected_completion_date,
    total_amount,
    contract_amount,
    profit_margin,
    created_by,
    updated_by
) VALUES
('PRJ001', 1, 'オフィス改装工事', '本社オフィスの改装工事', 'won', '2024-03-01', '2024-04-30', 3080000, 2800000, 20.0, 1, 1),
('PRJ002', 2, '設備更新作業', '空調設備の更新', 'won', '2024-03-15', '2024-05-15', 1650000, 1500000, 15.0, 1, 1),
('PRJ003', 3, '定期メンテナンス', '年次点検作業', 'lost', '2024-04-01', '2024-04-30', 495000, 450000, 10.0, 1, 1),
('PRJ004', 1, '新規オフィス工事', '支社オフィスの新規工事', 'lost', '2024-05-01', '2024-06-30', 5500000, 5000000, 25.0, 1, 1);

-- 6. 見積書データ
INSERT INTO quotations (
    quotation_number,
    project_id,
    issue_date,
    valid_until,
    subtotal,
    tax_amount,
    total_amount,
    status,
    created_by,
    updated_by
) VALUES
('QT001', 1, '2024-03-10', '2024-04-10', 835000, 83500, 918500, 'sent', 1, 1),
('QT002', 2, '2024-03-15', '2024-04-15', 490000, 49000, 539000, 'accepted', 1, 1),
('QT003', 3, '2024-03-20', '2024-04-20', 185000, 18500, 203500, 'draft', 1, 1);

-- 7. 見積書明細データ
INSERT INTO quotation_details (
    quotation_id,
    product_id,
    description,
    quantity,
    unit_price,
    tax_rate,
    amount,
    created_by
) VALUES
-- QT001（オフィス改装工事）の明細
(1, 1, '空調フィルター交換作業', 10, 15000, 10.0, 150000, 1),
(1, 2, 'LED照明器具設置', 15, 25000, 10.0, 375000, 1),
(1, 3, '配管部材交換', 20, 8000, 10.0, 160000, 1),
(1, 1, '空調システム保守点検', 5, 30000, 10.0, 150000, 1),

-- QT002（設備更新作業）の明細
(2, 1, '空調フィルター', 8, 15000, 10.0, 120000, 1),
(2, 2, 'LED照明器具', 10, 25000, 10.0, 250000, 1),
(2, 3, '配管部材一式', 15, 8000, 10.0, 120000, 1),

-- QT003（定期メンテナンス）の明細
(3, 1, '空調フィルター定期交換', 3, 15000, 10.0, 45000, 1),
(3, 2, 'LED照明メンテナンス', 4, 25000, 10.0, 100000, 1),
(3, 3, '配管点検・補修', 5, 8000, 10.0, 40000, 1);

-- 8. 工事情報データ
INSERT INTO construction_details (
    project_id,
    construction_date,
    completion_date,
    status,
    unit_price,
    contractor_id,
    progress,
    created_by,
    updated_by
) VALUES
(1, '2024-03-30', NULL, 'in_progress', 2800000, 1, 75, 1, 1),
(2, '2024-04-15', NULL, 'in_progress', 1500000, 2, 40, 1, 1),
(3, '2024-04-05', NULL, 'planned', 450000, 3, 0, 1, 1);

-- 9. コンタクト履歴データ
INSERT INTO contact_histories (
    customer_id,
    contact_date,
    contact_method,
    contact_person,
    notes,
    created_by
) VALUES
(1, '2024-03-15 10:00:00', '商談', '山田太郎', '新規案件の相談', 1),
(2, '2024-03-14 14:30:00', '見積提出', '鈴木一郎', '見積書を提出済み', 1),
(3, '2024-03-13 11:00:00', '電話対応', '佐藤次郎', '進捗確認の電話', 1);

-- 10. 請求書データ
INSERT INTO invoices (
    invoice_number,
    project_id,
    quotation_id,
    issue_date,
    due_date,
    subtotal,
    tax_amount,
    total_amount,
    status,
    notes,
    created_by,
    updated_by
) VALUES
('INV001', 1, 1, '2024-03-20', '2024-04-20', 835000, 83500, 918500, 'issued', '3月分請求書', 1, 1),
('INV002', 2, 2, '2024-03-25', '2024-04-25', 490000, 49000, 539000, 'draft', '4月分請求書', 1, 1),
('INV003', 3, 3, '2024-03-30', '2024-04-30', 185000, 18500, 203500, 'draft', '定期メンテナンス', 1, 1);

-- 11. 請求書明細データ
INSERT INTO invoice_details (
    invoice_id,
    product_id,
    description,
    quantity,
    unit_price,
    tax_rate,
    amount,
    created_by
) VALUES
-- INV001の明細
(1, 1, '空調フィルター交換作業', 10, 15000, 10.0, 150000, 1),
(1, 2, 'LED照明器具設置', 15, 25000, 10.0, 375000, 1),
(1, 3, '配管部材', 20, 8000, 10.0, 160000, 1),

-- INV002の明細
(2, 1, '空調フィルター', 8, 15000, 10.0, 120000, 1),
(2, 2, 'LED照明器具', 10, 25000, 10.0, 250000, 1),

-- INV003の明細
(3, 3, '配管部材', 5, 8000, 10.0, 40000, 1);

-- 発注書データ
INSERT INTO purchase_orders (
    order_number,
    supplier_id,
    project_id,
    order_date,
    delivery_date,
    subtotal,
    tax_amount,
    total_amount,
    status,
    approval_status,
    approved_by,
    approved_at,
    notes,
    created_by,
    updated_by
) VALUES
('PO001', 1, 1, '2024-03-05', '2024-03-20', 500000, 50000, 550000, 'ordered', 'approved', 1, '2024-03-05 15:00:00', '空調フィルター発注', 1, 1),
('PO002', 2, 2, '2024-03-10', '2024-03-25', 750000, 75000, 825000, 'pending', 'pending', NULL, NULL, 'LED照明器具発注', 1, 1),
('PO003', 3, 3, '2024-03-15', '2024-03-30', 200000, 20000, 220000, 'draft', 'pending', NULL, NULL, '配管部材発注', 1, 1);

-- 発注書明細データ
INSERT INTO purchase_order_details (
    order_id,
    product_id,
    description,
    quantity,
    unit_price,
    tax_rate,
    amount,
    delivery_status,
    received_quantity,
    received_date,
    created_by
) VALUES
-- PO001の明細
(1, 1, '空調フィルター A型', 20, 10000, 10.0, 200000, 'received', 20, '2024-03-20', 1),
(1, 3, '配管部材セット', 15, 5000, 10.0, 75000, 'received', 15, '2024-03-20', 1),

-- PO002の明細
(2, 2, 'LED照明器具 B型', 25, 18000, 10.0, 450000, 'pending', 0, NULL, 1),
(2, 3, '配管部材セット', 10, 5000, 10.0, 50000, 'pending', 0, NULL, 1),

-- PO003の明細
(3, 1, '空調フィルター C型', 10, 10000, 10.0, 100000, 'pending', 0, NULL, 1),
(3, 2, 'LED照明器具 A型', 5, 18000, 10.0, 90000, 'pending', 0, NULL, 1);

-- 承認ワークフローデータ
INSERT INTO approval_workflows (
    document_type,
    document_id,
    approver_id,
    status,
    approved_at
) VALUES
('purchase_order', 1, 1, 'approved', '2024-03-05 15:00:00'),
('purchase_order', 2, 1, 'pending', NULL),
('purchase_order', 3, 1, 'pending', NULL);

-- 経費データ
INSERT INTO expenses (
    expense_number,
    invoice_number,
    applicant_id,
    department,
    expense_date,
    receipt_date,
    amount,
    category,
    payment_method,
    description,
    purpose,
    receipt_image_url,
    status,
    created_by,
    updated_by
) VALUES
('EXP001', 'INV20240315001', 1, '営業部', '2024-03-15', '2024-03-15', 5000, 'transportation', 'cashless', '東京-大阪往復交通費', '取引先訪問', '/receipts/exp001.jpg', '申請中', 1, 1),
('EXP002', 'INV20240316001', 2, '技術部', '2024-03-16', '2024-03-16', 3000, 'meals', 'credit_card', '取引先との会食費', '商談', '/receipts/exp002.jpg', '申請中', 2, 2),
('EXP003', 'INV20240317001', 1, '営業部', '2024-03-17', '2024-03-17', 12000, 'supplies', 'cashless', 'オフィス用品購入', '消耗品補充', '/receipts/exp003.jpg', '承認済', 1, 1);

-- 経費承認データ
INSERT INTO expense_approvals (
    expense_id,
    approver_id,
    status,
    comment,
    approved_at
) VALUES
(3, 1, '承認済', '承認済み', CURRENT_TIMESTAMP),
(1, 1, '申請中', NULL, NULL),
(2, 2, '申請中', NULL, NULL);

-- 権限データの追加
INSERT INTO permissions (name, description) VALUES
-- アクセス制御用の大きな権限
('general.access', '一般業務へのアクセス権限'),
('approval.access', '承認業務へのアクセス権限'),

-- 案件管理
('project.view', '案件の閲覧'),
('project.create', '案件の作成'),
('project.edit', '案件の編集'),
('project.delete', '案件の削除'),

-- 見積書
('quotation.view', '見積書の閲覧'),
('quotation.create', '見積書の作成'),
('quotation.edit', '見積書の編集'),
('quotation.approve', '見積書の承認'),

-- 請求書
('invoice.view', '請求書の閲覧'),
('invoice.create', '請求書の作成'),
('invoice.edit', '請求書の編集'),
('invoice.approve', '請求書の承認'),

-- 経費
('expense.view', '経費の閲覧'),
('expense.create', '経費の作成'),
('expense.approve', '経費の承認'),

-- マスタ管理
('master.view', 'マスタの閲覧'),
('master.edit', 'マスタの編集'),

-- ユーザー管理
('user.view', 'ユーザーの閲覧'),
('user.create', 'ユーザーの作成'),
('user.edit', 'ユーザーの編集');

-- ロールと権限の関連付け
-- 管理者（admin）の権限設定
INSERT INTO role_permissions (role, permission_id) 
SELECT 'admin', permission_id 
FROM permissions 
WHERE name IN (
    'approval.access',
    'expense.approve',
    'quotation.approve',
    'invoice.approve'
);

-- マネージャー（manager）の権限設定
INSERT INTO role_permissions (role, permission_id)
SELECT 'manager', permission_id 
FROM permissions 
WHERE name IN (
    'approval.access',
    'expense.approve',
    'quotation.approve',
    'invoice.approve'
);

-- 一般スタッフ（staff）の権限設定
INSERT INTO role_permissions (role, permission_id)
SELECT 'staff', permission_id 
FROM permissions 
WHERE name IN (
    'general.access',
    'project.view',
    'project.create',
    'quotation.view',
    'quotation.create',
    'invoice.view',
    'invoice.create',
    'expense.view',
    'expense.create'
);

-- staffユーザーの追加
INSERT INTO users (user_id, username, password_hash, email, role, is_active, created_at, updated_at)
VALUES 
  (3, 'staff', '$2b$10$D8eVV1bQC9ttfnMhTISH0uqQc7RyVqRQW/e4QmAuYNvqdNbwnCCUG', 'staff@example.com', 'staff', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  