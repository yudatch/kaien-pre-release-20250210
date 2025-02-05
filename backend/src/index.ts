import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import { loggingMiddleware } from './middleware/logging';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

// CORSの設定を詳細に指定
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// リクエストボディのパース設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ロギングミドルウェア
app.use(loggingMiddleware);

let isDbConnected = false;
let isReady = false;

// データベース接続の設定
const DB_CONNECTION_CONFIG = {
  maxRetries: 5,
  initialRetryDelay: 1000,
  maxRetryDelay: 30000,
};

/**
 * 遅延を実行する関数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 指数バックオフ付きのリトライ遅延を計算
 */
const calculateBackoffDelay = (retryCount: number): number => {
  const backoffDelay = DB_CONNECTION_CONFIG.initialRetryDelay * Math.pow(2, retryCount);
  return Math.min(backoffDelay, DB_CONNECTION_CONFIG.maxRetryDelay);
};

/**
 * データベース接続状態を確認する関数
 */
const checkDatabaseConnection = async () => {
  let retryCount = 0;

  while (retryCount < DB_CONNECTION_CONFIG.maxRetries) {
    try {
      await sequelize.authenticate();
      if (retryCount > 0) {
        console.log('データベース接続が復旧しました');
      }
      isDbConnected = true;
      return true;
    } catch (error) {
      retryCount++;
      isDbConnected = false;
      
      if (retryCount === DB_CONNECTION_CONFIG.maxRetries) {
        console.error(`データベース接続エラー (${retryCount}/${DB_CONNECTION_CONFIG.maxRetries}回目):`, error);
        return false;
      }

      const backoffDelay = calculateBackoffDelay(retryCount);
      console.log(`データベース接続リトライ (${retryCount}/${DB_CONNECTION_CONFIG.maxRetries}回目) - ${backoffDelay}ms後に再試行`);
      await delay(backoffDelay);
    }
  }

  return false;
};

// 定期的なデータベース接続チェック
setInterval(checkDatabaseConnection, 5000);

// ヘルスチェックエンドポイントの改善
app.get('/health', async (req: express.Request, res: express.Response) => {
  const dbStatus = await checkDatabaseConnection();
  
  if (!dbStatus) {
    return res.status(503).json({
      status: 'error',
      message: 'データベース接続エラー',
      timestamp: new Date().toISOString()
    });
  }

  if (!isReady) {
    return res.status(503).json({
      status: 'initializing',
      message: 'アプリケーション初期化中',
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// データベース初期化処理
async function initializeDatabase() {
  try {
    console.log('データベース初期化を開始...');
    await sequelize.authenticate();
    console.log('データベース接続が確立されました');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('データベースが同期されました');
    }
    
    isDbConnected = true;
    return true;
  } catch (error) {
    console.error('データベース初期化エラー:', error);
    isDbConnected = false;
    return false;
  }
}

// アプリケーションの起動処理
initializeDatabase().then((dbInitialized) => {
  if (!dbInitialized) {
    console.error('データベース初期化に失敗しました');
    process.exit(1);
  }

  app.use(routes);
  app.use(errorHandler);

  const server = app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました`);
    isReady = true;
  });

  // グレースフルシャットダウンの処理
  const shutdown = () => {
    console.log('シャットダウンを開始します...');
    server.close(async () => {
      try {
        await sequelize.close();
        console.log('データベース接続を終了しました');
        process.exit(0);
      } catch (error) {
        console.error('シャットダウンエラー:', error);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}); 