import { Request, Response } from 'express';
import Expense from '../models/Expense';
import ExpenseApproval from '../models/ExpenseApproval';
import User from '../models/User';
import { Op } from 'sequelize';
import { generateExpenseNumber } from '../utils/expenseUtils';
import path from 'path';
import fs from 'fs';

// リクエストの詳細をログ出力するヘルパー関数
function logRequestDetails(req: Request) {
  console.log('\n=== リクエスト詳細 ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  if (req.file) {
    console.log('\n=== アップロードファイル情報 ===');
    console.log({
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      destination: req.file.destination,
      filename: req.file.filename,
      path: req.file.path,
      size: `${(req.file.size / 1024).toFixed(2)}KB`
    });

    // ファイルの存在確認と詳細情報
    const filePath = path.resolve(req.file.destination, req.file.filename);
    if (fs.existsSync(filePath)) {
      const fileStats = fs.statSync(filePath);
      console.log('\n=== ファイル詳細 ===');
      console.log({
        exists: true,
        size: `${(fileStats.size / 1024).toFixed(2)}KB`,
        lastModified: fileStats.mtime,
        created: fileStats.birthtime,
        permissions: fileStats.mode.toString(8),
        absolutePath: filePath,
        publicUrl: `/uploads/receipts/${req.file.filename}`
      });
    } else {
      console.log('\n=== ファイルエラー ===');
      console.log('ファイルが保存されていません:', filePath);
    }
  }
}

export class ExpenseController {
  // 経費の新規作成
  createExpense = async (req: Request, res: Response) => {
    try {
      console.log('\n=== 経費新規作成 開始 ===');
      console.log('リクエストボディ:', JSON.stringify(req.body, null, 2));
      
      if (req.file) {
        console.log('\n=== アップロードファイル情報 ===');
        console.log({
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: `${(req.file.size / 1024).toFixed(2)}KB`
        });
      } else {
        console.log('\n画像ファイルが添付されていません');
      }

      const expenseNumber = await generateExpenseNumber();
      console.log('生成された経費番号:', expenseNumber);
      
      const expenseData = {
        ...req.body,
        expense_number: expenseNumber,
        invoice_number: req.body.invoice_number || null,
        receipt_date: req.body.receipt_date || req.body.expense_date,
        applicant_id: 1, // TODO: 認証実装後に修正
        department: '開発部',
        status: '申請中',
        created_by: 1,
        updated_by: 1,
      };

      if (req.file) {
        expenseData.receipt_image_url = `/uploads/receipts/${req.file.filename}`;
        console.log('\n=== 保存する画像パス ===');
        console.log('receipt_image_url:', expenseData.receipt_image_url);
      }

      console.log('\n=== 保存するデータ ===');
      console.log(JSON.stringify(expenseData, null, 2));

      const expense = await Expense.create(expenseData);
      
      console.log('\n=== 保存されたデータ ===');
      console.log(JSON.stringify(expense, null, 2));
      console.log('=== 経費新規作成 完了 ===\n');

      res.status(201).json(expense);
    } catch (error) {
      console.error('\n=== 経費作成エラー ===');
      console.error('エラー詳細:', error);
      res.status(500).json({ message: '経費の作成に失敗しました' });
    }
  };

  // 経費の更新
  updateExpense = async (req: Request, res: Response) => {
    try {
      console.log('\n=== 経費更新 開始 ===');
      logRequestDetails(req);  // リクエストの詳細ログを追加
      
      if (req.file) {
        console.log('\n=== アップロードファイル情報 ===');
        console.log({
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: `${(req.file.size / 1024).toFixed(2)}KB`
        });

        // ファイルの存在確認と詳細情報
        const filePath = path.resolve(req.file.destination, req.file.filename);
        if (fs.existsSync(filePath)) {
          const fileStats = fs.statSync(filePath);
          console.log('\n=== ファイル詳細 ===');
          console.log({
            exists: true,
            size: `${(fileStats.size / 1024).toFixed(2)}KB`,
            lastModified: fileStats.mtime,
            created: fileStats.birthtime,
            permissions: fileStats.mode.toString(8),
            absolutePath: filePath,
            publicUrl: `/uploads/receipts/${req.file.filename}`
          });
        } else {
          console.log('\n=== ファイルエラー ===');
          console.log('ファイルが保存されていません:', filePath);
        }
      } else {
        console.log('\n画像ファイルが添付されていません');
      }

      const expense = await Expense.findByPk(req.params.id);
      if (!expense) {
        console.log('経費が見つかりません - ID:', req.params.id);
        return res.status(404).json({ message: '経費が見つかりません' });
      }

      console.log('\n=== 更新前の経費データ ===');
      console.log(JSON.stringify(expense, null, 2));

      // 既存の画像の削除処理
      if (expense.receipt_image_url && (req.file || req.body.receipt_image_url === 'null')) {
        const oldFilePath = path.join(__dirname, '../../public', expense.receipt_image_url);
        console.log('\n=== 古い画像の削除処理 ===');
        console.log('削除対象ファイル:', oldFilePath);
        
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log('古い画像を削除しました');
        } else {
          console.log('削除対象ファイルが存在しません');
        }
      }

      // 新しい画像がアップロードされた場合
      if (req.file) {
        req.body.receipt_image_url = `/uploads/receipts/${req.file.filename}`;
        console.log('\n=== 新しい画像パス ===');
        console.log('receipt_image_url:', req.body.receipt_image_url);
      } else if (req.body.receipt_image_url === 'null') {
        // フロントエンドから明示的に画像を削除する場合
        req.body.receipt_image_url = null;
        console.log('\n=== 画像の削除 ===');
        console.log('receipt_image_urlをnullに設定します');
      }

      const updateData = {
        ...req.body,
        updated_by: 1, // TODO: 認証実装後に修正
      };
      
      // receipt_imageフィールドを削除（これはファイルアップロード用のフィールドで、DBには保存しない）
      delete updateData.receipt_image;
      
      console.log('\n=== 更新データ ===');
      console.log(JSON.stringify(updateData, null, 2));

      await expense.update(updateData);

      console.log('\n=== 更新後の経費データ ===');
      console.log(JSON.stringify(expense, null, 2));
      console.log('=== 経費更新 完了 ===\n');

      res.json(expense);
    } catch (error) {
      console.error('\n=== 経費更新エラー ===');
      console.error('エラー詳細:', error);
      res.status(500).json({ message: '経費の更新に失敗しました' });
    }
  };

  // 経費一覧の取得
  async getExpenses(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const offset = (page - 1) * perPage;

      const expenses = await Expense.findAndCountAll({
        include: [
          {
            model: User,
            as: 'ExpenseRequestor',
            attributes: ['user_id', 'username', 'email'],
          },
          {
            model: ExpenseApproval,
            as: 'Approvals',
            include: [
              {
                model: User,
                as: 'ExpenseApprovalUser',
                attributes: ['user_id', 'username', 'email'],
              },
            ],
          },
        ],
        order: [['created_at', 'DESC']],
        limit: perPage,
        offset,
        distinct: true,
      });

      res.json({
        expenses: expenses.rows,
        total: expenses.count,
        page,
        perPage,
        totalPages: Math.ceil(expenses.count / perPage),
      });
    } catch (error) {
      console.error('経費一覧の取得に失敗しました:', error);
      res.status(500).json({ message: '経費一覧の取得に失敗しました' });
    }
  }

  // 承認待ち経費一覧の取得
  async getPendingExpenses(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const offset = (page - 1) * perPage;

      const expenses = await Expense.findAndCountAll({
        where: {
          status: '申請中',
        },
        include: [
          {
            model: User,
            as: 'ExpenseRequestor',
            attributes: ['user_id', 'username', 'email'],
          },
          {
            model: ExpenseApproval,
            as: 'Approvals',
            include: [
              {
                model: User,
                as: 'ExpenseApprovalUser',
                attributes: ['user_id', 'username', 'email'],
              },
            ],
          },
        ],
        order: [['created_at', 'DESC']],
        limit: perPage,
        offset,
      });

      res.json({
        expenses: expenses.rows,
        total: expenses.count,
        page,
        perPage,
        totalPages: Math.ceil(expenses.count / perPage),
      });
    } catch (error) {
      console.error('Error in getPendingExpenses:', error);
      res.status(500).json({ message: '承認待ち経費一覧の取得に失敗しました' });
    }
  }

  // 経費詳細の取得
  async getExpense(req: Request, res: Response) {
    try {
      const expenseId = parseInt(req.params.id);
      const expense = await Expense.findByPk(expenseId, {
        include: [
          {
            model: User,
            as: 'ExpenseRequestor',
            attributes: ['user_id', 'username', 'email'],
          },
          {
            model: ExpenseApproval,
            as: 'Approvals',
            include: [
              {
                model: User,
                as: 'ExpenseApprovalUser',
                attributes: ['user_id', 'username', 'email'],
              },
            ],
          },
        ],
      });

      if (!expense) {
        return res.status(404).json({ message: '経費が見つかりません' });
      }

      res.json(expense);
    } catch (error) {
      console.error('Error in getExpense:', error);
      res.status(500).json({ message: '経費の取得に失敗しました' });
    }
  }

  // 経費の削除
  async deleteExpense(req: Request, res: Response) {
    try {
      const expense = await Expense.findByPk(req.params.id);

      if (!expense) {
        return res.status(404).json({ message: '経費が見つかりません' });
      }

      if (expense.status === '承認済') {
        return res.status(400).json({ message: 'この経費は削除できません' });
      }

      // 画像ファイルの削除
      if (expense.receipt_image_url) {
        const imagePath = path.join(__dirname, '../../public', expense.receipt_image_url);
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (error) {
          console.error('Error in deleteExpense:', error);
        }
      }

      await expense.destroy();

      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteExpense:', error);
      res.status(500).json({ message: '経費の削除に失敗しました' });
    }
  }

  // 経費の承認
  async approveExpense(req: Request, res: Response) {
    try {
      const expense = await Expense.findByPk(req.params.id);

      if (!expense) {
        return res.status(404).json({ message: '経費が見つかりません' });
      }

      if (expense.status !== '申請中') {
        return res.status(400).json({ message: 'この経費は承認できません' });
      }

      await ExpenseApproval.create({
        expense_id: expense.expense_id,
        approver_id: 1, // 開発用の固定値
        status: '承認済',
        comment: req.body.comment,
      });

      await expense.update({
        status: '承認済',
        updated_by: 1, // 開発用の固定値
      });

      res.json(expense);
    } catch (error) {
      console.error('Error in approveExpense:', error);
      res.status(500).json({ message: '経費の承認に失敗しました' });
    }
  }

  // 経費の否認
  async rejectExpense(req: Request, res: Response) {
    try {
      const expense = await Expense.findByPk(req.params.id);

      if (!expense) {
        return res.status(404).json({ message: '経費が見つかりません' });
      }

      if (expense.status !== '申請中') {
        return res.status(400).json({ message: 'この経費は否認できません' });
      }

      await ExpenseApproval.create({
        expense_id: expense.expense_id,
        approver_id: 1, // 開発用の固定値
        status: '否認',
        comment: req.body.comment,
      });

      await expense.update({
        status: '否認',
        updated_by: 1, // 開発用の固定値
      });

      res.json(expense);
    } catch (error) {
      console.error('Error in rejectExpense:', error);
      res.status(500).json({ message: '経費の否認に失敗しました' });
    }
  }
} 