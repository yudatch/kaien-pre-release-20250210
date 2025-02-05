const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// electron-is-devの代わりに環境変数で判定
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:3000').catch(err => {
      console.error('フロントエンド接続エラー:', err);
      app.quit();
    });
  } else {
    const htmlPath = path.join(__dirname, '../frontend/.next/server/pages/index.html');
    if (!fs.existsSync(htmlPath)) {
      console.error('ビルドファイルが見つかりません');
      app.quit();
      return;
    }
    win.loadFile(htmlPath);
  }

  win.on('closed', () => {
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});