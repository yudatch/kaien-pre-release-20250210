const { spawn } = require('child_process');
const waitOn = require('wait-on');
const axios = require('axios');
const path = require('path');

async function checkServiceHealth(url, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        console.log(`サービス ${url} の準備が完了しました`);
        return true;
      }
    } catch (error) {
      console.log(`サービス ${url} の準備待機中... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  return false;
}

async function startElectron() {
  try {
    console.log('Dockerコンテナの起動を待機中...');
    
    await new Promise(resolve => setTimeout(resolve, 15000));

    console.log('サービスの健全性チェックを開始...');
    
    const [frontendReady, backendReady] = await Promise.all([
      checkServiceHealth('http://localhost:3000'),
      checkServiceHealth('http://localhost:3001/health')
    ]);

    if (!frontendReady || !backendReady) {
      throw new Error('サービスの起動タイムアウト: フロントエンドまたはバックエンドの準備ができていません');
    }

    console.log('全てのサービスの準備が完了しました');

    const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
    
    if (!require('fs').existsSync(electronPath)) {
      throw new Error('Electronが見つかりません。npm installを実行してください。');
    }

    const electron = spawn(electronPath, ['.'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development',
        ELECTRON_START_URL: 'http://localhost:3000'
      },
      shell: process.platform === 'win32'
    });

    electron.on('error', (err) => {
      console.error('Electronの起動に失敗:', err);
      process.exit(1);
    });

    electron.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Electronが異常終了しました（終了コード: ${code}）`);
      }
      process.exit(code);
    });

    const cleanup = () => {
      console.log('アプリケーションを終了中...');
      electron.kill();
      process.exit();
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    process.exit(1);
  }
}

startElectron(); 