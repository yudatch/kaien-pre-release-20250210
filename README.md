# 業務管理システム

## 概要
業務管理・会計機能を提供するシステムです。顧客管理、案件管理、仕入管理、工事管理などの機能を提供します。
Web版とデスクトップアプリケーション（Electron）の両方で利用可能です。

## 技術スタック
- フロントエンド
  - Next.js 14
  - TypeScript
  - Material-UI
  - Axios
  - React Hook Form（フォーム管理）
  - Zod（バリデーション）

- バックエンド
  - Express
  - TypeScript
  - Sequelize
  - PostgreSQL
  - Express Validator

- デスクトップアプリケーション
  - Electron
  - Node.js

- インフラ
  - Docker
  - Docker Compose

## 開発環境のセットアップ

### 必要条件
- Docker
- Docker Compose
- Node.js 20.x以上
- npm 10.x以上

### インストール手順

1. リポジトリのクローン
```bash
git clone git@github.com:UUTech-LLC/kaien.git
cd kaien
```

2. 環境変数の設定
```bash
cp .env.example .env
```
必要に応じて`.env`ファイルの内容を編集してください。

3. 依存関係のインストール
```bash
npm install
```

4. 初回起動

#### Web版の場合
```bash
# 初回のみ実行
npm run clean        # 既存のDockerリソースをクリーンアップ
npm run dev:build    # コンテナのビルドと起動
```

#### デスクトップアプリの場合
```bash
# 初回のみ実行
npm run clean         # 既存のDockerリソースをクリーンアップ
npm run electron:dev:full   # Dockerコンテナから起動（推奨）
```

5. 2回目以降の起動

#### Web版
```bash
npm run dev:browser   # ブラウザで開く（推奨）
# または
npm run dev          # コンテナのみ起動
```

#### デスクトップアプリ
```bash
npm run electron:dev   # Dockerコンテナを起動（推奨）
# または
npm run electron:dev:full   # Dockerコンテナから起動（推奨）
```

6. 動作確認
- Web版: http://localhost:3000 にアクセス
- デスクトップアプリ: 自動的にウィンドウが起動します

### トラブルシューティング

#### よくある問題と解決方法

1. ポートの競合が発生する場合
```bash
# 既存のコンテナとボリュームを削除
npm run clean:docker
```

2. 依存関係のエラーが発生する場合
```bash
# node_modulesを削除して再インストール
npm run clean:modules
npm install
```

3. アプリケーションが正常に起動しない場合
```bash
# すべてをクリーンアップして再起動
npm run clean
npm install
npm run dev:
```

## 開発用コマンド

### アプリケーションの起動

#### npmコマンド（推奨）
```bash
# Web版の開発環境
npm run dev           # Dockerコンテナのみ起動
npm run dev:browser   # Dockerコンテナを起動し、ブラウザで開く
npm run dev:build     # コンテナを再ビルドして起動（初回や依存関係の変更時）

# デスクトップアプリケーション
npm run electron:dev:full   # Dockerコンテナから起動（推奨）
npm run electron:dev        # 既存のDocker環境を使用
npm run electron:dev:clean  # クリーンインストール後に起動
```

#### Makeコマンド（代替手段）
```bash
# Web版の開発環境
make dev              # Dockerコンテナのみ起動
make dev-with-browser # ブラウザで開く
make build-dev        # コンテナを再ビルド

# 本番環境
make prod             # 本番環境の起動
make build-prod       # 本番環境のビルドと起動
```

### ビルドとデプロイ

```bash
# Web版の本番環境
npm run prod          # 本番環境の起動
npm run prod:build    # 本番環境のビルドと起動

# デスクトップアプリケーション
npm run electron:build    # ビルドとパッケージング
npm run electron:package  # パッケージのみ作成
npm run electron:make     # 配布用インストーラーの作成
```

### ユーティリティ

#### npmコマンド
```bash
# 環境のクリーンアップ
npm run clean         # Docker環境とモジュールの完全クリーンアップ
npm run clean:docker  # Dockerリソースのクリーンアップ
npm run clean:modules # node_modulesのクリーンアップ

# Docker操作
npm run down          # コンテナの停止
npm run logs          # コンテナのログ表示
npm run restart       # コンテナの再起動
```

#### Makeコマンド
```bash
# Docker操作
make down            # コンテナの停止
make restart         # コンテナの再起動
make logs           # コンテナのログ表示
make clean          # Dockerリソースのクリーンアップ（ボリューム含む）
```

## ディレクトリ構成
```
.
├── frontend/          # フロントエンドアプリケーション（Next.js）
├── backend/           # バックエンドAPI（Express）
├── electron/          # Electron関連ファイル
│   ├── main.js          # メインプロセス
│   └── preload.js       # プリロードスクリプト
├── scripts/          # 開発用スクリプト
└── docs/            # ドキュメント
```

## 主な機能

### 顧客管理
- 顧客情報の登録・編集
- コンタクト履歴の管理
- 顧客ごとの案件一覧
- カスタマイズ可能な顧客フォーム

### 案件管理
- 案件情報の登録・編集
- 進捗管理
- 見積書・請求書の作成
- プロジェクトテンプレート機能

### 仕入管理
- 仕入先管理
- 発注管理
- 在庫管理
- 発注書の自動生成

### 工事管理
- 工事情報の登録・編集
- 進捗管理
- 工程表の作成
- 工事写真管理

### ドキュメント管理
- 各種書類のテンプレート管理
- ドキュメントのプレビュー機能
- PDFエクスポート
- 電子署名対応

### システム共通機能
- 高度なフォームバリデーション
- レスポンシブデザイン
- ダークモード対応
- データのエクスポート/インポート

## 参考資料

- [Gitのコミットメッセージの書き方](https://qiita.com/itosho/items/9565c6ad2ffc24c09364) - 伊藤 翔
- [Gitのブランチ命名規則](https://qiita.com/Hashimoto-Noriaki/items/5d990e21351b331d2aa1) - 橋本 典明

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。