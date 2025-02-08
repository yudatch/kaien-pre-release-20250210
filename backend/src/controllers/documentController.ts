import { Request, Response } from 'express';
import { Model, ModelStatic } from 'sequelize';
import { Project, Customer, Quotation, QuotationDetail, Invoice, InvoiceDetail, Product } from '../models';
import sequelize from '../config/database';
import { Transaction } from 'sequelize';
import { Op } from 'sequelize';

// モデルの型定義
interface IQuotation extends Model {
  quotation_id: number;
  quotation_number: string;
  project_id: number;
  issue_date: Date;
  valid_until: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  notes: string;
  created_by: number;
  Project?: {
    project_name: string;
    Customer?: {
      name: string;
      postal_code: string;
      address: string;
    };
  };
  QuotationDetails?: IQuotationDetail[];
}

interface IInvoice extends Model {
  invoice_id: number;
  invoice_number: string;
  project_id: number;
  issue_date: Date;
  due_date: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  notes: string;
  created_by: number;
  Project?: {
    project_name: string;
    Customer?: {
      name: string;
      postal_code: string;
      address: string;
    };
  };
  InvoiceDetails?: IInvoiceDetail[];
}

// モデルの型アサーション
const ProductModel = Product as ModelStatic<IProduct>;
const QuotationModel = Quotation as ModelStatic<IQuotation>;
const QuotationDetailModel = QuotationDetail as ModelStatic<IQuotationDetail>;

export const getQuotationPreview = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const projectId = req.params.projectId;
    console.log('=== getQuotationPreview ===');
    console.log('リクエストパラメータ:', { projectId });
    
    let quotation = await Quotation.findOne({
      where: { project_id: projectId },
      include: [
        {
          model: Project,
          include: [{ 
            model: Customer,
            as: 'Customer',
            attributes: ['name', 'postal_code', 'address']
          }]
        },
        {
          model: QuotationDetail,
          include: [{ 
            model: Product,
            attributes: ['name', 'product_code']
          }]
        }
      ]
    }) as unknown as IQuotation;

    // 見積書が存在しない場合は新規作成
    if (!quotation) {
      console.log('見積書が見つからないため新規作成します - projectId:', projectId);
      
      const today = new Date();
      const dateStr = today.toISOString().slice(0,10).replace(/-/g,'');
      const quotationNumber = `${dateStr}${Math.floor(Math.random() * 1000)}`;

      quotation = await Quotation.create({
        quotation_number: quotationNumber,
        project_id: projectId,
        issue_date: today,
        valid_until: new Date(today.setMonth(today.getMonth() + 1)),
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        status: 'draft',
        notes: '',
        created_by: 1
      }, { transaction }) as unknown as IQuotation;

      await transaction.commit();

      // 作成した見積書を再取得
      quotation = await Quotation.findOne({
        where: { quotation_id: quotation.quotation_id },
        include: [
          {
            model: Project,
            include: [{ 
              model: Customer,
              as: 'Customer',
              attributes: ['name', 'postal_code', 'address']
            }]
          }
        ]
      }) as unknown as IQuotation;
    }

    const response = {
      quotationId: quotation.quotation_id,
      projectName: quotation.Project?.project_name || 'プロジェクト名なし',
      customerName: quotation.Project?.Customer?.name || '顧客名なし',
      customerPostalCode: quotation.Project?.Customer?.postal_code || '',
      customerAddress: quotation.Project?.Customer?.address || '',
      details: quotation.QuotationDetails?.map(detail => ({
        detail_id: detail.detail_id,
        product_id: detail.product_id,
        productName: detail.Product?.name || '商品名なし',
        quantity: detail.quantity,
        unit: detail.unit || '個',
        unitPrice: detail.unit_price,
        amount: detail.amount
      })) || [],
      taxAmount: quotation.tax_amount,
      totalAmount: quotation.total_amount,
      notes: quotation.notes
    };

    console.log('レスポンスデータ:', JSON.stringify(response, null, 2));
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error('見積もりプレビューエラー:', error);
    res.status(500).json({ 
      success: false,
      error: '見積もりの取得に失敗しました' 
    });
  }
};

export const getInvoicePreview = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const projectId = req.params.projectId;
    
    let invoice = await Invoice.findOne({
      where: { project_id: projectId },
      include: [
        {
          model: Project,
          as: 'Project',
          include: [{ 
            model: Customer,
            as: 'Customer',
            attributes: ['name', 'postal_code', 'address']
          }]
        },
        {
          model: InvoiceDetail,
          include: [{ model: Product }]
        }
      ]
    }) as unknown as IInvoice;

    // 請求書が存在しない場合は新規作成
    if (!invoice) {
      console.log('請求書が見つからないため新規作成します - projectId:', projectId);
      
      const today = new Date();
      const dateStr = today.toISOString().slice(0,10).replace(/-/g,'');
      const invoiceNumber = `${dateStr}${Math.floor(Math.random() * 1000)}`;

      invoice = await Invoice.create({
        invoice_number: invoiceNumber,
        project_id: projectId,
        issue_date: today,
        due_date: new Date(today.setMonth(today.getMonth() + 1)),
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        status: 'draft',
        notes: '',
        created_by: 1
      }, { transaction }) as unknown as IInvoice;

      await transaction.commit();

      // 作成した請求書を再取得
      invoice = await Invoice.findOne({
        where: { invoice_id: invoice.invoice_id },
        include: [
          {
            model: Project,
            include: [{ 
              model: Customer,
              attributes: ['name', 'postal_code', 'address']
            }]
          }
        ]
      }) as unknown as IInvoice;
    }

    const response = {
      invoiceId: invoice.invoice_id,
      projectName: invoice.Project?.project_name || 'プロジェクト名なし',
      customerName: invoice.Project?.Customer?.name || '顧客名なし',
      customerPostalCode: invoice.Project?.Customer?.postal_code || '',
      customerAddress: invoice.Project?.Customer?.address || '',
      details: invoice.InvoiceDetails?.map(detail => ({
        detail_id: detail.detail_id,
        product_id: detail.product_id,
        productName: detail.Product?.name || '商品名なし',
        quantity: detail.quantity,
        unit: detail.unit || '個',
        unitPrice: detail.unit_price,
        amount: detail.amount
      })) || [],
      taxAmount: invoice.tax_amount,
      totalAmount: invoice.total_amount,
      notes: invoice.notes
    };

    console.log('InvoicePreview response:', response);
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error('請求書プレビューエラー:', error);
    res.status(500).json({ 
      success: false,
      error: '請求書の取得に失敗しました' 
    });
  }
};

export const updateQuotation = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.projectId;
  const updateData: QuotationUpdateData = req.body;
  const transaction = await sequelize.transaction();

  try {
    console.log('=== updateQuotation ===');
    console.log('リクエストパラメータ:', { projectId });
    console.log('リクエストボディ:', JSON.stringify(updateData, null, 2));

    const quotation = await QuotationModel.findOne({
      where: { project_id: projectId },
      include: [{ 
        model: QuotationDetail,
        include: [{ model: Product }]
      }]
    });

    if (!quotation) {
      console.log('見積書が見つかりません - projectId:', projectId);
      res.status(404).json({ error: '見積書が見つかりません' });
      return;
    }

    try {
      // 見積書本体の更新
      console.log('見積書本体の更新開始');
      await quotation.update({
        tax_amount: updateData.taxAmount,
        total_amount: updateData.totalAmount,
        notes: updateData.notes,
        updated_at: new Date()
      }, { transaction });

      // 明細の更新または追加
      console.log('明細の更新開始');
      const createdDetailIds: number[] = []; // 新規作成した明細のIDを保持する配列

      for (const detail of updateData.details) {
        console.log('処理中の明細:', detail);
        
        // 商品の存在確認と更新または作成
        let product;
        if (detail.productId && detail.productId > 0) {
          product = await ProductModel.findByPk(detail.productId);
          if (product) {
            console.log('商品の更新:', detail.productId);
            await product.update({
              name: detail.productName,
              price: detail.unitPrice
            }, { transaction });
          }
        }

        if (!product) {
          console.log('新規商品の作成:', detail.productName);
          const timestamp = Date.now();
          product = await ProductModel.create({
            product_id: detail.productId || null,
            product_code: `P${timestamp}`,
            name: detail.productName,
            price: detail.unitPrice,
            created_by: 1
          }, { transaction });
        }

        // 明細の更新または追加
        if (!detail.detailId || detail.detailId === -1) {
          // 新規明細の場合、最大のdetail_idを取得して+1
          const maxDetailId = await QuotationDetailModel.max('detail_id', { transaction }) || 0;
          const newDetailId = maxDetailId + 1;
          
          console.log('新規明細の作成:', newDetailId);
          const newDetail = {
            detail_id: newDetailId,
            quotation_id: quotation.quotation_id,
            product_id: product.product_id,
            quantity: detail.quantity,
            unit: detail.unit || '個',
            unit_price: detail.unitPrice,
            tax_rate: 10,
            amount: detail.amount,
          };
          console.log('新規明細データ:', newDetail);
          await QuotationDetailModel.create(newDetail, { transaction });

          createdDetailIds.push(newDetailId);
        } else {
          // 既存明細の更新
          const quotationDetail = await QuotationDetailModel.findOne({
            where: { 
              detail_id: detail.detailId,
              quotation_id: quotation.quotation_id
            },
            transaction
          });

          if (quotationDetail) {
            console.log('明細の更新:', detail.detailId);
            await quotationDetail.update({
              product_id: product.product_id,
              quantity: detail.quantity,
              unit: detail.unit || '個',
              unit_price: detail.unitPrice,
              amount: detail.amount,
            }, { transaction });
          } else {
            console.log('明細が見つからないため新規作成:', detail.detailId);
            await QuotationDetailModel.create({
              detail_id: detail.detailId,
              quotation_id: quotation.quotation_id,
              product_id: product.product_id,
              quantity: detail.quantity,
              unit: detail.unit || '個',
              unit_price: detail.unitPrice,
              tax_rate: 10,
              amount: detail.amount,
            }, { transaction });
          }
        }
      }

      // 削除された明細の処理
      const updatedDetailIds = updateData.details
        .filter(d => d.detailId !== -1) // -1を除外
        .map(d => d.detailId)
        .concat(createdDetailIds); // 新規作成した明細のIDを追加

      console.log('削除対象外の明細ID:', updatedDetailIds);
      await QuotationDetailModel.destroy({
        where: {
          quotation_id: quotation.quotation_id,
          detail_id: {
            [Op.notIn]: updatedDetailIds
          }
        },
        transaction
      });

      await transaction.commit();
      console.log('トランザクションのコミット完了');

      // 更新後のデータを取得
      const updatedQuotation = await QuotationModel.findOne({
        where: { project_id: projectId },
        include: [
          {
            model: Project,
            include: [{ 
              model: Customer,
              attributes: ['name']
            }]
          },
          {
            model: QuotationDetail,
            include: [{ 
              model: Product,
              attributes: ['name', 'product_code']
            }]
          }
        ]
      });

      if (!updatedQuotation) {
        throw new Error('更新後のデータが見つかりません');
      }

      // レスポンスデータの作成
      const response = {
        quotationId: updatedQuotation.quotation_id,
        projectName: updatedQuotation.Project?.project_name || 'プロジェクト名なし',
        customerName: updatedQuotation.Project?.Customer?.name || '顧客名なし',
        customerPostalCode: updatedQuotation.Project?.Customer?.postal_code || '',
        customerAddress: updatedQuotation.Project?.Customer?.address || '',
        details: updatedQuotation.QuotationDetails?.map(detail => ({
          detail_id: detail.detail_id,
          product_id: detail.product_id,
          productName: detail.Product?.name || '商品名なし',
          quantity: detail.quantity,
          unit: detail.unit || '個',
          unitPrice: detail.unit_price,
          amount: detail.amount
        })) || [],
        taxAmount: updatedQuotation.tax_amount,
        totalAmount: updatedQuotation.total_amount,
        notes: updatedQuotation.notes
      };

      console.log('レスポンスデータ:', JSON.stringify(response, null, 2));
      res.json(response);
    } catch (error) {
      console.error('トランザクション内でエラー発生:', error);
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('見積書更新エラー:', error);
    if (!transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({ error: '見積書の更新に失敗しました' });
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.projectId;
  const updateData: InvoiceUpdateData = req.body;
  const transaction = await sequelize.transaction();

  try {
    console.log('=== updateInvoice ===');
    console.log('リクエストパラメータ:', { projectId });
    console.log('リクエストボディ:', JSON.stringify(updateData, null, 2));

    const invoice = await Invoice.findOne({
      where: { project_id: projectId },
      include: [{ 
        model: InvoiceDetail,
        include: [{ model: Product }]
      }]
    });

    if (!invoice) {
      console.log('請求書が見つかりません - projectId:', projectId);
      res.status(404).json({ error: '請求書が見つかりません' });
      return;
    }

    try {
      // 請求書本体の更新
      console.log('請求書本体の更新開始');
      await invoice.update({
        tax_amount: updateData.taxAmount,
        total_amount: updateData.totalAmount,
        notes: updateData.notes,
        updated_at: new Date()
      }, { transaction });

      // 明細の更新または追加
      console.log('明細の更新開始');
      const createdDetailIds: number[] = []; // 新規作成した明細のIDを保持する配列

      for (const detail of updateData.details) {
        console.log('処理中の明細:', detail);
        
        // 商品の存在確認と更新または作成
        let product;
        if (detail.productId && detail.productId > 0) {
          product = await Product.findByPk(detail.productId);
          if (product) {
            console.log('商品の更新:', detail.productId);
            await product.update({
              name: detail.productName,
              price: detail.unitPrice
            }, { transaction });
          }
        }

        if (!product) {
          console.log('新規商品の作成:', detail.productName);
          const timestamp = Date.now();
          product = await Product.create({
            product_id: detail.productId || null,
            product_code: `P${timestamp}`,
            name: detail.productName,
            price: detail.unitPrice,
            created_by: 1
          }, { transaction });
        }

        // 明細の更新または追加
        if (!detail.detailId || detail.detailId === -1) {
          // 新規明細の場合、最大のdetail_idを取得して+1
          const maxDetailId = await InvoiceDetail.max('detail_id', { transaction }) || 0;
          const newDetailId = maxDetailId + 1;
          
          console.log('新規明細の作成:', newDetailId);
          const newDetail = {
            detail_id: newDetailId,
            invoice_id: invoice.invoice_id,
            product_id: product.product_id,
            quantity: detail.quantity,
            unit: detail.unit || '個',
            unit_price: detail.unitPrice,
            tax_rate: 10,
            amount: detail.amount,
            created_by: 1,
            updated_by: 1
          };
          console.log('新規明細データ:', newDetail);
          await InvoiceDetail.create(newDetail, { transaction });

          createdDetailIds.push(newDetailId);
        } else {
          // 既存明細の更新
          const invoiceDetail = await InvoiceDetail.findOne({
            where: { 
              detail_id: detail.detailId,
              invoice_id: invoice.invoice_id
            },
            transaction
          });

          if (invoiceDetail) {
            console.log('明細の更新:', detail.detailId);
            await invoiceDetail.update({
              product_id: product.product_id,
              quantity: detail.quantity,
              unit: detail.unit || '個',
              unit_price: detail.unitPrice,
              amount: detail.amount,
              updated_by: 1
            }, { transaction });
          } else {
            console.log('明細が見つからないため新規作成:', detail.detailId);
            await InvoiceDetail.create({
              detail_id: detail.detailId,
              invoice_id: invoice.invoice_id,
              product_id: product.product_id,
              quantity: detail.quantity,
              unit: detail.unit || '個',
              unit_price: detail.unitPrice,
              tax_rate: 10,
              amount: detail.amount,
              created_by: 1,
              updated_by: 1
            }, { transaction });
          }
        }
      }

      // 削除された明細の処理
      const updatedDetailIds = updateData.details
        .filter(d => d.detailId !== -1)
        .map(d => d.detailId)
        .concat(createdDetailIds);

      console.log('削除対象外の明細ID:', updatedDetailIds);
      await InvoiceDetail.destroy({
        where: {
          invoice_id: invoice.invoice_id,
          detail_id: {
            [Op.notIn]: updatedDetailIds
          }
        },
        transaction
      });

      await transaction.commit();
      console.log('トランザクションのコミット完了');

      // 更新後のデータを取得
      const updatedInvoice = await Invoice.findOne({
        where: { project_id: projectId },
        include: [
          {
            model: Project,
            include: [{ 
              model: Customer,
              attributes: ['name']
            }]
          },
          {
            model: InvoiceDetail,
            include: [{ 
              model: Product,
              attributes: ['name', 'product_code']
            }]
          }
        ]
      });

      if (!updatedInvoice) {
        throw new Error('更新後のデータが見つかりません');
      }

      // レスポンスデータの作成
      const response = {
        invoiceId: updatedInvoice.invoice_id,
        projectName: updatedInvoice.Project?.project_name || 'プロジェクト名なし',
        customerName: updatedInvoice.Project?.Customer?.name || '顧客名なし',
        customerPostalCode: updatedInvoice.Project?.Customer?.postal_code || '',
        customerAddress: updatedInvoice.Project?.Customer?.address || '',
        details: updatedInvoice.InvoiceDetails?.map(detail => ({
          detail_id: detail.detail_id,
          product_id: detail.product_id,
          productName: detail.Product?.name || '商品名なし',
          quantity: detail.quantity,
          unit: detail.unit || '個',
          unitPrice: detail.unit_price,
          amount: detail.amount
        })) || [],
        taxAmount: updatedInvoice.tax_amount,
        totalAmount: updatedInvoice.total_amount,
        notes: updatedInvoice.notes
      };

      console.log('レスポンスデータ:', JSON.stringify(response, null, 2));
      res.json(response);
    } catch (error) {
      console.error('トランザクション内でエラー発生:', error);
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('請求書更新エラー:', error);
    if (!transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({ error: '請求書の更新に失敗しました' });
  }
};

// 見積書作成
export const createQuotation = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      project_id,
      details,
      tax_amount,
      total_amount,
      notes
    } = req.body;

    // 見積番号の生成（例：QT + YYYYMMDD + 連番）
    const today = new Date();
    const dateStr = today.toISOString().slice(0,10).replace(/-/g,'');
    const quotationNumber = `${dateStr}${Math.floor(Math.random() * 1000)}`;

    // 見積書のヘッダー作成
    const quotation = await Quotation.create({
      quotation_number: quotationNumber,
      project_id,
      issue_date: today,
      valid_until: new Date(today.setMonth(today.getMonth() + 1)), // 1ヶ月後を有効期限とする
      tax_amount,
      total_amount,
      status: 'draft',
      notes,
      created_by: 1 // TODO: 認証ユーザーIDを使用
    }, { transaction });

    // 見積明細の作成
    await Promise.all(
      details.map((detail: any) =>
        QuotationDetail.create({
          quotation_id: quotation.quotation_id,
          product_id: detail.product_id,
          description: detail.description,
          quantity: detail.quantity,
          unit: detail.unit || '個',
          unit_price: detail.unit_price,
          tax_rate: 10,
          amount: detail.quantity * detail.unit_price,
          created_by: 1 // TODO: 認証ユーザーIDを使用
        }, { transaction })
      )
    );

    await transaction.commit();
    
    res.status(201).json({
      message: '見積書が作成されました',
      quotation_id: quotation.quotation_id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('見積書作成エラー:', error);
    res.status(500).json({ error: '見積書の作成に失敗しました' });
  }
};

// 見積書削除
export const deleteQuotation = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const quotationId = req.params.quotationId;
    
    // 関連する請求書の存在確認
    const relatedInvoice = await Invoice.findOne({
      where: { quotation_id: quotationId }
    });

    const quotation = await Quotation.findOne({
      where: { quotation_id: quotationId }
    });
    
    if (!quotation) {
      res.status(404).json({ 
        success: false,
        error: '見積書が見つかりません' 
      });
      return;
    }

    // 関連する明細も含めて削除
    await quotation.destroy({ transaction });
    
    await transaction.commit();
    res.json({ 
      success: true,
      message: '見積書が削除されました' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('見積書削除エラー:', error);
    res.status(500).json({ 
      success: false,
      error: '見積書の削除に失敗しました' 
    });
  }
};

// 請求書作成
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      project_id,
      quotation_id,
      details,
      tax_amount,
      total_amount,
      notes
    } = req.body;

    // 請求番号の生成（例：IV + YYYYMMDD + 連番）
    const today = new Date();
    const dateStr = today.toISOString().slice(0,10).replace(/-/g,'');
    const invoiceNumber = `${dateStr}${Math.floor(Math.random() * 1000)}`;

    // 請求書のヘッダー作成
    const invoice = await Invoice.create({
      invoice_number: invoiceNumber,
      project_id,
      quotation_id,
      issue_date: today,
      due_date: new Date(today.setMonth(today.getMonth() + 1)), // 1ヶ月後を支払期限とする
      tax_amount,
      total_amount,
      status: 'draft',
      notes,
      created_by: 1 // TODO: 認証ユーザーIDを使用
    }, { transaction });

    // 請求明細の作成
    await Promise.all(
      details.map((detail: any) =>
        InvoiceDetail.create({
          invoice_id: invoice.invoice_id,
          product_id: detail.product_id,
          description: detail.description,
          quantity: detail.quantity,
          unit: detail.unit || '個',
          unit_price: detail.unit_price,
          tax_rate: 10,
          amount: detail.quantity * detail.unit_price,
          created_by: 1 // TODO: 認証ユーザーIDを使用
        }, { transaction })
      )
    );

    await transaction.commit();
    
    res.status(201).json({
      message: '請求書が作成されました',
      invoice_id: invoice.invoice_id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('請求書作成エラー:', error);
    res.status(500).json({ error: '請求書の作成に失敗しました' });
  }
};

// 請求書削除
export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findOne({
      where: { invoice_id: invoiceId }
    });
    
    if (!invoice) {
      res.status(404).json({ 
        success: false,
        error: '請求書が見つかりません' 
      });
      return;
    }

    // 関連する明細も含めて削除
    await invoice.destroy({ transaction });
    
    await transaction.commit();
    res.json({ 
      success: true,
      message: '請求書が削除されました' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('請求書削除エラー:', error);
    res.status(500).json({ 
      success: false,
      error: '請求書の削除に失敗しました' 
    });
  }
};

/**
 * 請求書一覧を取得
 */
export const getInvoiceList = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: Project,
          as: 'Project',
          include: [
            {
              model: Customer,
              as: 'Customer',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedInvoices = invoices.map(invoice => ({
      invoice_id: invoice.invoice_id,
      document_number: invoice.invoice_number,
      project_id: invoice.project_id,
      issue_date: invoice.issue_date,
      subtotal: invoice.subtotal,
      tax_amount: invoice.tax_amount,
      total_amount: invoice.total_amount,
      status: invoice.status,
      notes: invoice.notes,
      project: {
        name: invoice.Project?.project_name,
        customer: {
          name: invoice.Project?.Customer?.name
        }
      },
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
      created_by: invoice.created_by,
      updated_by: invoice.updated_by
    }));

    res.json({
      success: true,
      data: formattedInvoices
    });
  } catch (error) {
    console.error('請求書一覧の取得に失敗:', error);
    res.status(500).json({
      success: false,
      message: '請求書一覧の取得に失敗しました。'
    });
  }
};

/**
 * 見積書一覧を取得
 */
export const getQuotationList = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotations = await Quotation.findAll({
      include: [
        {
          model: Project,
          include: [
            {
              model: Customer,
              as: 'Customer',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedQuotations = quotations.map(quotation => ({
      quotation_id: quotation.quotation_id,
      document_number: quotation.quotation_number,
      project_id: quotation.project_id,
      issue_date: quotation.issue_date,
      valid_until: quotation.valid_until,
      subtotal: quotation.subtotal,
      tax_amount: quotation.tax_amount,
      total_amount: quotation.total_amount,
      status: quotation.status,
      notes: quotation.notes,
      project: {
        name: quotation.Project?.project_name,
        customer: {
          name: quotation.Project?.Customer?.name
        }
      },
      created_at: quotation.created_at,
      updated_at: quotation.updated_at,
      created_by: quotation.created_by,
      updated_by: quotation.updated_by
    }));

    res.json({
      success: true,
      data: formattedQuotations
    });
  } catch (error) {
    console.error('見積書一覧の取得に失敗:', error);
    res.status(500).json({
      success: false,
      message: '見積書一覧の取得に失敗しました。'
    });
  }
}; 