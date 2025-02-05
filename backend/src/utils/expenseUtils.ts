import Expense from '../models/Expense';
import { Op } from 'sequelize';

/**
 * 経費番号を生成する
 * フォーマット: EXP + YYYYMM + 4桁連番
 * 例: EXP20240300001
 */
export async function generateExpenseNumber(): Promise<string> {
  const today = new Date();
  const yearMonth = today.getFullYear().toString() + 
    (today.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `EXP${yearMonth}`;

  // 同じ年月の最後の経費番号を取得
  const lastExpense = await Expense.findOne({
    where: {
      expense_number: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['expense_number', 'DESC']],
  });

  let sequence = 1;
  if (lastExpense) {
    // 最後の4桁を取得して1を加算
    const lastSequence = parseInt(lastExpense.expense_number.slice(-4));
    sequence = lastSequence + 1;
  }

  // 4桁の連番を生成（0埋め）
  const sequenceStr = sequence.toString().padStart(4, '0');
  return `${prefix}${sequenceStr}`;
} 