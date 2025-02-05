import express from 'express';
import projectsRouter from './projects';
import customersRouter from './customers';
import purchasesRouter from './purchases';
import documentsRouter from './documents';
import constructionDetailsRouter from './constructionDetails';
import expensesRouter from './expenses';
import authRouter from './auth';
import dashboardRouter from './dashboard';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 認証ルート（認証不要）
router.use('/auth', authRouter);

// 以下のルートは認証が必要
router.use('/api/dashboard', authenticateToken, dashboardRouter);
router.use('/api/projects', authenticateToken, projectsRouter);
router.use('/api/customers', authenticateToken, customersRouter);
router.use('/api/purchases', authenticateToken, purchasesRouter);
router.use('/api/documents', authenticateToken, documentsRouter);
router.use('/api/construction-details', authenticateToken, constructionDetailsRouter);
router.use('/api/expenses', authenticateToken, expensesRouter);

export default router; 