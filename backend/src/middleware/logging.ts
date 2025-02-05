import { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // リクエストの詳細をログ出力
  console.log('\n=== リクエスト開始 ===');
  console.log('タイムスタンプ:', new Date().toISOString());
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  if (Object.keys(req.query).length > 0) {
    console.log('Query:', JSON.stringify(req.query, null, 2));
  }

  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }

  // ファイルアップロード情報
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
  }

  // レスポンス完了時の処理
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`\n=== レスポンス完了 ===`);
    console.log(`ステータス: ${res.statusCode}`);
    console.log(`処理時間: ${duration}ms`);
    console.log('=== リクエスト終了 ===\n');
  });

  next();
}; 