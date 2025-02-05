import { Request, Response } from 'express';
import Customer from '../models/Customer';
import { CustomerInput } from '../types/customer';
import { generateCustomerCode } from '../utils/codeGenerator';

// 顧客一覧取得
export const getCustomerList = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: '顧客一覧の取得に失敗しました。'
    });
  }
};

// 顧客詳細取得
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '顧客が見つかりません。'
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: '顧客の取得に失敗しました。'
    });
  }
};

// 顧客作成
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customerData: CustomerInput = req.body;
    
    // 顧客コードの生成
    const customerCode = await generateCustomerCode();
    const customer = await Customer.create({
      ...customerData,
      customer_code: customerCode,
    });

    res.status(201).json({
      success: true,
      data: customer,
      message: '顧客が作成されました'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '顧客の作成に失敗しました' 
    });
  }
};

// 顧客更新
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerData: Partial<CustomerInput> = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '顧客が見つかりません。'
      });
    }

    await customer.update(customerData);

    res.json({
      success: true,
      data: customer,
      message: '顧客情報が更新されました'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '顧客情報の更新に失敗しました' 
    });
  }
};

// 顧客削除
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: '顧客が見つかりません。'
      });
    }

    await customer.destroy();
    res.json({
      success: true,
      message: '顧客が削除されました'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: '顧客の削除に失敗しました' 
    });
  }
}; 