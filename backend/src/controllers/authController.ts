import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Permission, RolePermission } from '../models';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

interface JWTPayload {
  userId: number;
  username: string;
  role: string;
  permissions: string[];
}

export const login = async (req: LoginRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('ログイン試行:', { username });

    // ユーザーを検索
    const user = await User.findOne({
      where: { username, is_active: true }
    });

    console.log('ユーザー検索結果:', {
      found: !!user,
      username: user?.username,
      passwordHash: user?.password_hash
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ユーザー名またはパスワードが正しくありません。'
      });
    }

    // パスワードの検証
    console.log('パスワード検証:', {
      inputPassword: password,
      storedHash: user.password_hash
    });

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('パスワード検証結果:', { isValidPassword });

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'ユーザー名またはパスワードが正しくありません。'
      });
    }

    // ユーザーの権限を取得
    const permissions = await Permission.findAll({
      include: [{
        model: RolePermission,
        as: 'RolePermissions',
        where: { role: user.role },
        attributes: []
      }],
      attributes: ['name']
    });

    console.log('取得した権限:', permissions.map(p => p.name));

    // JWTトークンの生成
    const payload: JWTPayload = {
      userId: user.user_id,
      username: user.username,
      role: user.role,
      permissions: permissions.map(p => p.name)
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      data: {
        token,
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        permissions: permissions.map(p => p.name)
      }
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({
      success: false,
      message: 'ログイン処理中にエラーが発生しました。'
    });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証トークンが必要です。'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = await User.findOne({
      where: { user_id: decoded.userId, is_active: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ユーザーが見つかりません。'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        permissions: decoded.permissions
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: '無効な認証トークンです。'
    });
  }
}; 