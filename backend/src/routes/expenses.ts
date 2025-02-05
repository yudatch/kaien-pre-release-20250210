import express from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import upload from '../middleware/upload';

const router = express.Router();
const expenseController = new ExpenseController();

// 経費一覧の取得
router.get('/', expenseController.getExpenses.bind(expenseController));

// 承認待ち経費一覧の取得
router.get('/pending', expenseController.getPendingExpenses.bind(expenseController));

// 経費詳細の取得
router.get('/:id', expenseController.getExpense.bind(expenseController));

// 経費の新規作成（画像アップロード対応）
router.post('/', upload('receipt_image'), expenseController.createExpense.bind(expenseController));

// 経費の更新（画像アップロード対応）
router.put('/:id', upload('receipt_image'), expenseController.updateExpense.bind(expenseController));

// 経費の削除
router.delete('/:id', expenseController.deleteExpense.bind(expenseController));

// 経費の承認
router.post('/:id/approve', expenseController.approveExpense.bind(expenseController));

// 経費の否認
router.post('/:id/reject', expenseController.rejectExpense.bind(expenseController));

export default router; 