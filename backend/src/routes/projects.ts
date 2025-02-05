import { Router } from 'express';
import {
  getProjectList,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController';

const router = Router();

// プロジェクト一覧の取得
router.get('/', getProjectList);

// プロジェクト詳細の取得
router.get('/:id', getProjectById);

// プロジェクトの作成
router.post('/', createProject);

// プロジェクトの更新
router.put('/:id', updateProject);

// プロジェクトの削除
router.delete('/:id', deleteProject);

export default router;
