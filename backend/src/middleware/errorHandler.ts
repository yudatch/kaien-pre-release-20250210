import { Request, Response, NextFunction } from 'express';

/**
 * グローバルエラーハンドリングミドルウェア
 * 
 * @description
 * アプリケーション全体でキャッチされなかったエラーを処理する
 * 開発環境では詳細なエラー情報を、本番環境では一般的なエラーメッセージを返す
 * 
 * @param err - エラーオブジェクト
 * @param req - リクエストオブジェクト
 * @param res - レスポンスオブジェクト
 * @param next - 次のミドルウェアを実行する関数
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] エラー発生:`, {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  res.status(500).json({
    error: 'サーバーエラーが発生しました',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}; 