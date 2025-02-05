import { Router } from 'express';
import {
  getCustomerList,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController';

const router = Router();

// 顧客一覧の取得
router.get('/', getCustomerList);

// 顧客詳細の取得
router.get('/:id', getCustomerById);

// 顧客の作成
router.post('/', createCustomer);

// 顧客の更新
router.put('/:id', updateCustomer);

// 顧客の削除
router.delete('/:id', deleteCustomer);

export default router; 