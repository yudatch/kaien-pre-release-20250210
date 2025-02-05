import { Router, Request, Response } from 'express';
import { 
  createPurchaseOrder,
  approvePurchaseOrder,
  updateDeliveryStatus,
  getPurchaseOrderList,
  getPurchaseOrderDetail,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getProducts,
  getSuppliers
} from '../controllers/purchaseController';

const router = Router();

// 発注オーダー関連のエンドポイント
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('[Purchases] 発注一覧取得リクエスト受信');
    const startTime = Date.now();
    await getPurchaseOrderList(req, res);
    const responseTime = Date.now() - startTime;
    console.log(`[Purchases] レスポンス送信完了 (処理時間: ${responseTime}ms)`);
  } catch (error) {
    console.error('[Purchases] エラー発生:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '発注一覧の取得に失敗しました' });
    }
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    await getPurchaseOrderDetail(req, res);
  } catch (error) {
    console.error('[Purchases] 発注詳細取得エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '発注詳細の取得に失敗しました' });
    }
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    await createPurchaseOrder(req, res);
  } catch (error) {
    console.error('[Purchases] 発注作成エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '発注の作成に失敗しました' });
    }
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    await updatePurchaseOrder(req, res);
  } catch (error) {
    console.error('[Purchases] 発注更新エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '発注の更新に失敗しました' });
    }
  }
});

router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    await approvePurchaseOrder(req, res);
  } catch (error) {
    console.error('[Purchases] 発注承認エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '発注の承認処理に失敗しました' });
    }
  }
});

router.patch('/:id/items/:itemId/delivery', async (req: Request, res: Response) => {
  try {
    await updateDeliveryStatus(req, res);
  } catch (error) {
    console.error('[Purchases] 納品状態更新エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '納品状態の更新に失敗しました' });
    }
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await deletePurchaseOrder(req, res);
  } catch (error) {
    console.error('[Purchases] 発注削除エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '発注の削除に失敗しました' });
    }
  }
});

// マスターデータ関連のエンドポイント
router.get('/master/products', async (req: Request, res: Response) => {
  try {
    await getProducts(req, res);
  } catch (error) {
    console.error('[Purchases] 商品マスタ取得エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '商品マスタの取得に失敗しました' });
    }
  }
});

router.get('/master/suppliers', async (req: Request, res: Response) => {
  try {
    await getSuppliers(req, res);
  } catch (error) {
    console.error('[Purchases] 仕入先マスタ取得エラー:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '仕入先マスタの取得に失敗しました' });
    }
  }
});

export default router;