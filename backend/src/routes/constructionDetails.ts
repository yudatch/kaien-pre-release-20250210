import { Router } from 'express';
import {
  getConstructionDetailList,
  getConstructionDetailById,
  createConstructionDetail,
  updateConstructionDetail,
  deleteConstructionDetail
} from '../controllers/constructionDetailController';

const router = Router();

// 工事詳細一覧の取得
router.get('/', getConstructionDetailList);

// 工事詳細の取得
router.get('/:id', getConstructionDetailById);

// 工事詳細の作成
router.post('/', createConstructionDetail);

// 工事詳細の更新
router.put('/:id', updateConstructionDetail);

// 工事詳細の削除
router.delete('/:id', deleteConstructionDetail);

export default router;