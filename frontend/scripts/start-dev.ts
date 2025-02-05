import { spawn } from 'child_process';
import axios, { AxiosError } from 'axios';
import open from 'open';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const HEALTH_ENDPOINT = '/health';
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 2000;
const STARTUP_DELAY = 5000; // バックエンド準備完了後の追加待機時間

// 環境の判定
const isProd = process.argv.includes('--prod');
const shouldOpenBrowser = true;

async function checkBackend(retries = 0): Promise<boolean> {
  if (retries >= MAX_RETRIES) {
    console.error(`バックエンドの起動確認が${MAX_RETRIES}回失敗しました。`);
    return false;
  }

  const healthUrl = `${BACKEND_URL}${HEALTH_ENDPOINT}`;
  console.log(`バックエンドの起動を確認中... (${retries + 1}/${MAX_RETRIES})`);
  console.log(`確認先URL: ${healthUrl}`);
  
  try {
    const response = await axios.get(healthUrl, { 
      timeout: 2000,
      validateStatus: (status) => status === 200
    });
    console.log('バックエンドの準備が完了しました！');
    console.log('レスポンス:', response.data);

    // バックエンドの準備完了後、追加で待機
    console.log(`バックエンドの安定化のため${STARTUP_DELAY}ms待機します...`);
    await new Promise(resolve => setTimeout(resolve, STARTUP_DELAY));
    return true;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.code === 'ECONNREFUSED') {
      console.log(`バックエンドが起動していません。待機します... (${healthUrl})`);
      console.log('エラー詳細:', axiosError.message);
    } else if (axiosError.code === 'ETIMEDOUT') {
      console.log('バックエンドの応答がタイムアウトしました。再試行します...');
      console.log('エラー詳細:', axiosError.message);
    } else if (axiosError.response) {
      console.log(`バックエンドが異常な状態です（ステータス: ${axiosError.response.status}）。再試行します...`);
      console.log('レスポンス詳細:', axiosError.response.data);
    } else {
      console.log('バックエンドとの通信に失敗しました。再試行します...');
      console.log('エラー詳細:', axiosError.message);
    }

    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    return checkBackend(retries + 1);
  }
}

async function startServer() {
  console.log('フロントエンド起動プロセスを開始します...');
  
  // バックエンドの起動確認
  const isBackendReady = await checkBackend();
  if (!isBackendReady) {
    if (isProd) {
      console.error('本番環境ではバックエンドが必須です。起動を中止します。');
      process.exit(1);
    }
    console.warn('警告: バックエンドが応答しない状態でフロントエンドを起動します。');
    console.warn('一部の機能が正常に動作しない可能性があります。');
  }

  // サーバーの起動
  const command = isProd ? 'next start' : 'next dev';
  console.log(`${isProd ? '本番' : '開発'}モードでフロントエンドを起動します...`);
  
  const server = spawn(command, [], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1', // テレメトリを無効化して起動を高速化
      WATCHPACK_POLLING: 'true',    // ホットリロードのためのファイル監視を有効化
      CHOKIDAR_USEPOLLING: 'true'   // ファイル変更の検知を強化
    }
  });

  // 開発環境の場合のみブラウザを開く
  if (!isBackendReady) {
    console.warn('注意: バックエンドが起動していないため、APIリクエストは失敗する可能性があります。');
  }
  
  if (shouldOpenBrowser) {
    console.log('ブラウザを起動します...');
    // Next.jsの起動完了を待ってからブラウザを開く
    setTimeout(() => {
      open('http://localhost:3000');
    }, 5000); // ブラウザ起動までの待機時間を増やす
  }

  // プロセス終了時の処理
  const cleanup = () => {
    console.log('\nフロントエンドを終了します...');
    server.kill();
    process.exit();
  };

  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
}

startServer().catch(error => {
  console.error('予期せぬエラーが発生しました:', error);
  process.exit(1);
}); 