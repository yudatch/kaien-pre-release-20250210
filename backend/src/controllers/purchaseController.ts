import { Request, Response } from 'express';
import { Purchase, PurchaseDetail, Product, Supplier, PurchaseOrder, PurchaseOrderDetail, ApprovalWorkflow } from '../models';
import sequelize from '../config/database';
import { DeliveryStatus } from '../types/enums';
import { QueryTypes } from 'sequelize';

export const createPurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      supplier_id,
      project_id,
      delivery_date,
      items,
      notes
    } = req.body;

    // 発注番号の生成（例：PO + YYYYMMDD + 連番）
    const today = new Date();
    const dateStr = today.toISOString().slice(0,10).replace(/-/g,'');
    const orderNumber = `PO${dateStr}${Math.floor(Math.random() * 1000)}`;

    // 小計、税額、合計金額の計算
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unit_price), 0);
    const taxAmount = subtotal * 0.1; // 税率10%と仮定
    const totalAmount = subtotal + taxAmount;

    // 発注書のヘッダー作成
    const purchaseOrder = await PurchaseOrder.create({
      order_number: orderNumber,
      supplier_id,
      project_id,
      order_date: today,
      delivery_date,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: 'pending',
      approval_status: 'pending',
      notes,
      created_by: 1
    }, { transaction });

    // 発注明細の作成
    const orderDetails = await Promise.all(
      items.map((item: any) => 
        PurchaseOrderDetail.create({
          order_id: purchaseOrder.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: 10, // 税率10%と仮定
          amount: item.quantity * item.unit_price,
          delivery_status: 'pending',
          created_by: 1
        }, { transaction })
      )
    );

    await transaction.commit();
    
    res.status(201).json({
      success: true,
      data: {
        ...purchaseOrder.toJSON(),
        details: orderDetails
      },
      message: '発注書が作成されました'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('発注書作成エラー:', error);
    res.status(500).json({ 
      success: false,
      error: '発注書の作成に失敗しました' 
    });
  }
};

export const approvePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { order_id } = req.params;
    const { status, notes } = req.body;
    const user_id = 1; // TODO: 認証ユーザーIDを使用

    const order = await PurchaseOrder.findByPk(order_id);
    if (!order) {
      res.status(404).json({ error: '発注書が見つかりません' });
      return;
    }

    // 承認ワークフローの作成
    await ApprovalWorkflow.create({
      document_type: 'purchase_order',
      document_id: order_id,
      approver_id: user_id,
      status: status,
      approved_at: new Date(),
      notes: notes
    }, { transaction });

    // 発注書のステータス更新
    await order.update({
      approval_status: status,
      approved_by: user_id,
      approved_at: new Date(),
      status: status === 'approved' ? 'ordered' : 'cancelled'
    }, { transaction });

    await transaction.commit();
    res.json({ message: '承認状態が更新されました' });
  } catch (error) {
    await transaction.rollback();
    console.error('承認処理エラー:', error);
    res.status(500).json({ error: '承認処理に失敗しました' });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await PurchaseOrder.findByPk(orderId);
    if (!order) {
      res.status(404).json({ 
        success: false,
        error: '発注書が見つかりません' 
      });
      return;
    }

    await order.update({ delivery_status: status });
    res.json({ 
      success: true,
      message: '納品状態が更新されました' 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '納品状態の更新に失敗しました' 
    });
  }
};

export const getPurchaseOrderList = async (req: Request, res: Response): Promise<void> => {
  try {
    // デバッグ用のrawクエリを追加
    const rawOrders = await sequelize.query(
      'SELECT * FROM purchase_orders',
      { type: QueryTypes.SELECT }
    );
    console.log('Raw SQL結果:', rawOrders);

    const orders = await PurchaseOrder.findAll({
      include: [
        {
          model: Supplier,
          attributes: ['name', 'supplier_code'],
          required: true  // INNER JOINに変更
        },
        {
          model: PurchaseOrderDetail,
          include: [{
            model: Product,
            attributes: ['name', 'product_code'],
            required: true  // INNER JOINに変更
          }],
          required: false  // LEFT JOINのまま
        }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log('Sequelize結果:', JSON.stringify(orders, null, 2));

    res.json(orders);
  } catch (error) {
    console.error('発注一覧取得エラー:', error);
    console.error('詳細なエラー:', error instanceof Error ? error.stack : error);
    res.status(500).json({ error: '発注一覧の取得に失敗しました' });
  }
};

export const updatePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { order_id } = req.params;
    const {
      supplier_id,
      project_id,
      delivery_date,
      items,
      notes
    } = req.body;

    const order = await PurchaseOrder.findByPk(order_id);
    if (!order) {
      res.status(404).json({ error: '発注書が見つかりません' });
      return;
    }

    // 発注書のヘッダー更新
    await order.update({
      supplier_id,
      project_id,
      delivery_date,
      notes,
      updated_by: 1 // TODO: 認証ユーザーIDを使用
    }, { transaction });

    // 発注明細の更新
    for (const item of items) {
      if (item.detail_id) {
        // 既存明細の更新
        await PurchaseOrderDetail.update({
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.quantity * item.unit_price,
          updated_by: 1 // TODO: 認証ユーザーIDを使用
        }, {
          where: { detail_id: item.detail_id },
          transaction
        });
      } else {
        // 新規明細の追加
        await PurchaseOrderDetail.create({
          order_id: order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.quantity * item.unit_price,
          tax_rate: 10,
          delivery_status: 'pending',
          created_by: 1 // TODO: 認証ユーザーIDを使用
        }, { transaction });
      }
    }

    await transaction.commit();
    
    res.json({
      message: '発注書が更新されました',
      order: await PurchaseOrder.findByPk(order_id, {
        include: [{ model: PurchaseOrderDetail }]
      })
    });
  } catch (error) {
    await transaction.rollback();
    console.error('発注書更新エラー:', error);
    res.status(500).json({ error: '発注書の更新に失敗しました' });
  }
};

export const getPurchaseOrderDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id } = req.params;
    const order = await PurchaseOrder.findByPk(order_id, {
      include: [
        {
          model: Supplier,
          attributes: ['name', 'supplier_code']
        },
        {
          model: PurchaseOrderDetail,
          include: [{
            model: Product,
            attributes: ['name', 'product_code']
          }]
        }
      ]
    });

    if (!order) {
      res.status(404).json({ error: '発注書が見つかりません' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('発注書詳細取得エラー:', error);
    res.status(500).json({ error: '発注書の取得に失敗しました' });
  }
};

export const deletePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    const { orderId } = req.params;
    const order = await PurchaseOrder.findByPk(orderId);
    
    if (!order) {
      res.status(404).json({ 
        success: false,
        error: '発注書が見つかりません' 
      });
      return;
    }

    await order.destroy({ transaction });
    await transaction.commit();
    res.json({ 
      success: true,
      message: '発注書が削除されました' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '発注書の削除に失敗しました' 
    });
  }
};

// 商品マスタ取得
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.findAll({
      attributes: ['product_id', 'product_code', 'name', 'price'],
      order: [['product_code', 'ASC']]
    });
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('[Products] 商品マスタ取得エラー:', error);
    res.status(500).json({ 
      success: false,
      error: '商品マスタの取得に失敗しました' 
    });
  }
};

// 仕入先マスタ取得
export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await Supplier.findAll({
      attributes: ['supplier_id', 'supplier_code', 'name'],
      order: [['supplier_code', 'ASC']]
    });
    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error('[Suppliers] 仕入先マスタ取得エラー:', error);
    res.status(500).json({ 
      success: false,
      error: '仕入先マスタの取得に失敗しました' 
    });
  }
};

export const updateApprovalStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await PurchaseOrder.findByPk(orderId);
    if (!order) {
      res.status(404).json({ 
        success: false,
        error: '発注書が見つかりません' 
      });
      return;
    }

    await order.update({ approval_status: status });
    res.json({ 
      success: true,
      message: '承認状態が更新されました' 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '承認状態の更新に失敗しました' 
    });
  }
};

export const getPurchaseOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await PurchaseOrder.findAll({
      include: [
        { model: Supplier },
        { model: PurchaseOrderDetail, include: [{ model: Product }] }
      ]
    });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '発注データの取得に失敗しました' 
    });
  }
};

export const getPurchaseOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await PurchaseOrder.findOne({
      where: { order_id: orderId },
      include: [
        { model: Supplier },
        { model: PurchaseOrderDetail, include: [{ model: Product }] }
      ]
    });

    if (!order) {
      res.status(404).json({ 
        success: false,
        error: '発注書が見つかりません' 
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '発注書の取得に失敗しました' 
    });
  }
};