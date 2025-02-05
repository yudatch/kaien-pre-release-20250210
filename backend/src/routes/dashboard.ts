import { Router, Request, Response } from 'express';
import sequelize from "../config/database";
import {
  Customer,
  Project,
  Product,
  ConstructionDetail,
  Quotation,
  ContactHistory,
  Purchase
} from "../models";
import { startOfMonth, format } from 'date-fns';
import { Op } from 'sequelize';
import { DashboardData, ProjectStatusCount } from '../types/dashboard';

const router = Router();

/**
 * データベース操作時のエラー型定義
 * 
 * @interface DatabaseError
 * @extends Error
 * 
 * @property {string} name - エラーの種類を示す名前
 * @property {string} message - エラーの詳細メッセージ
 * @property {string} [stack] - エラーのスタックトレース（オプション）
 */
interface DatabaseError extends Error {
  name: string;
  message: string;
  stack?: string;
}

/**
 * ダッシュボードのサマリー情報を取得
 * 
 * @route GET /api/dashboard
 * @returns {Promise<DashboardData>} ダッシュボードに表示する各種データ
 * 
 * @example
 * // レスポンス例
 * {
 *   customers: {
 *     totalCustomers: 100,
 *     newCustomersThisMonth: 5,
 *     activeProjects: 10,
 *     recentContacts: [...]
 *   },
 *   projects: {...},
 *   purchases: {...},
 *   constructions: {...}
 * }
 * 
 * @throws {DatabaseError} データベースクエリ実行時のエラー
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('[Dashboard] サマリーリクエスト受信');
    
    const startTime = Date.now();

    /**
     * 並列でデータを取得
     * Promise.allを使用して複数のクエリを同時実行し、パフォーマンスを最適化
     */
    const [
      customers,
      newCustomers,
      projects,
      quotations,
      products,
      constructions,
      contacts,
      purchases
    ] = await Promise.all([
      /**
       * アクティブな顧客の総数を取得
       * @returns {Promise<{ count: number, rows: Customer[] }>}
       */
      Customer.findAndCountAll({
        where: { is_active: true }
      }),
      
      /**
       * 今月の新規顧客数を取得
       * @returns {Promise<number>} 今月登録された顧客数
       */
      Customer.count({
        where: {
          created_at: {
            [Op.gte]: startOfMonth(new Date())
          }
        }
      }),

      // 3. 案件のステータス別集計
      Project.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('project_id')), 'count'] // ステータスごとの件数を集計
        ],
        group: ['status'] // ステータスでグループ化
      }),

      // 4. 最新の見積情報を3件取得（プロジェクト名も含む）
      Quotation.findAll({
        limit: 3,
        order: [['created_at', 'DESC']], // 最新順
        include: [{
          model: Project,
          attributes: ['project_name'] // プロジェクト名のみ取得
        }]
      }),

      // 5. 在庫が最小在庫数を下回っている商品を取得
      Product.findAll({
        where: sequelize.literal('current_stock < minimum_stock')
      }),

      // 6. 進行中の工事情報を取得
      ConstructionDetail.findAll({
        where: { status: 'in_progress' },
        include: [{
          model: Project,
          as: 'Project',
          attributes: ['project_name'],
          required: false
        }]
      }),

      // 7. 最新の顧客コンタクト履歴を3件取得
      ContactHistory.findAll({
        limit: 3,
        order: [['contact_date', 'DESC']], // 最新順
        include: [{
          model: Customer,
          attributes: ['name'] // 顧客名のみ取得
        }]
      }),

      // 8. 今月の仕入れ情報を集計
      Purchase.findOne({
        where: {
          created_at: {
            [Op.gte]: startOfMonth(new Date()) // 月初から現在まで
          }
        },
        attributes: [
          // 集計用のカスタム属性を定義
          [sequelize.fn('COUNT', sequelize.col('purchase_id')), 'count'], // 総件数
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'total'], // 合計金額
          [sequelize.literal(`SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`), 'pending'] // 保留中の件数
        ]
      })
    ]);

    /**
     * プロジェクトステータスの集計
     * @type {ProjectStatusCount} ステータス別の案件数
     */
    const projectStatusCounts = projects.reduce((acc: ProjectStatusCount, curr: any) => {
      const status = curr.status as keyof ProjectStatusCount;
      acc[status] = parseInt(curr.get('count'));
      return acc;
    }, {
      draft: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    });

    /**
     * フロントエンド用のレスポンスデータを構築
     * @type {DashboardData}
     */
    const dashboardData = {
      customers: {
        totalCustomers: customers.count,
        newCustomersThisMonth: newCustomers,
        activeProjects: projects.filter((p: { status: string }) => 
          p.status === 'in_progress').length,
        recentContacts: contacts.map((c: any) => ({
          customerName: c.Customer.name,
          date: format(c.contact_date, 'yyyy-MM-dd'),
          type: c.contact_method
        }))
      },

      // 案件関連情報
      projects: {
        totalProjects: Object.values(projectStatusCounts)
          .reduce((a: number, b: number) => a + b, 0),  // 総案件数
        projectsByStatus: projectStatusCounts,  // ステータス別件数
        recentQuotations: quotations.map((q: any) => ({  // 最近の見積
          projectName: q.Project.project_name,
          amount: q.total_amount,
          status: q.status
        }))
      },

      // 仕入関連情報
      purchases: {
        totalPurchases: purchases?.getDataValue('count') || 0,  // 総仕入件数
        monthlyExpenses: purchases?.getDataValue('total') || 0,  // 今月の仕入額
        pendingOrders: purchases?.getDataValue('pending') || 0,  // 保留中の発注
        lowStockProducts: products.map(p => ({  // 在庫警告商品
          name: p.name,
          currentStock: p.current_stock,
          minimumStock: p.minimum_stock
        }))
      },

      // 工事関連情報
      constructions: {
        activeConstructions: constructions.length,  // 進行中の工事数
        upcomingDeadlines: constructions.map(c => ({  // 期
          projectName: c.Project?.project_name || '不明なプロジェクト',
          deadline: c.completion_date,
          progress: c.progress || 0
        }))
      }
    };

    const responseTime = Date.now() - startTime;
    console.log(`[Dashboard] レスポンス送信完了 (総処理時間: ${responseTime}ms)`);
    
    res.json(dashboardData);

  } catch (error) {
    const dbError = error as DatabaseError;
    console.error('[Dashboard] エラー発生:', {
      message: dbError.message,
      name: dbError.name,
      stack: dbError.stack,
      timestamp: new Date().toISOString()
    });
    
    if (dbError.name === 'SequelizeEagerLoadingError') {
      res.status(500).json({
        error: 'データベースクエリエラー',
        details: 'アソシエーション設定に問題があります'
      });
    } else {
      res.status(500).json({
        error: 'サーバーエラー',
        message: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  }
});

export default router; 