const waitOn = require('wait-on');
const openBrowser = require('open');

const waitForServices = async () => {
  console.log('サービスの起動を待機中...');
  
  try {
    await waitOn({
      resources: [
        'http://localhost:3001/health',
        'http://localhost:3000'
      ],
      delay: 1000,
      interval: 1000,
      timeout: 120000,
      verbose: false,
      log: false
    });

    console.log('全てのサービスが起動しました');
    await openBrowser('http://localhost:3000');

  } catch (error) {
    console.error('サービスの起動に失敗しました:', error);
    process.exit(1);
  }
};

waitForServices();

if (process.platform === 'win32') {
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

const cleanup = () => {
  console.log('\nシャットダウン中...');
  process.exit();
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);