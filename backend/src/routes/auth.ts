import express from 'express';
import { login, verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// ログインエンドポイント
router.post('/login', login);

// トークン検証エンドポイント
router.get('/verify', authenticateToken, verifyToken);

export default router; 