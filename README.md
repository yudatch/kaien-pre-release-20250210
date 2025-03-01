# マルチサイトスクレイパー

## 概要
このアプリケーションは、複数のECサイトから商品情報をスクレイピングし、ロゴ検出機能を使って商品画像をフィルタリングするツールです。Streamlitを使用したUIと、Celery+Redisによる非同期処理を実装しています。

## 主な機能
1. マルチサイトスクレイパー機能
   - サイト設定管理画面（新規追加/編集可能）
   - プルダウンで実行サイトを選択可能

2. キーワード検索機能
   - 複数キーワード対応（カンマ区切り）
   - サイトごとの検索結果を自動収集
   - 検索結果の商品数をリアルタイム表示

3. ロゴ検出バッチ処理
   - 選択サイトの商品一覧をスクレイピング
   - ロゴ検出モデル（LogoDet-3Kベース）でフィルタリング
   - 進捗バーとエラーログ表示

4. 結果管理画面
   - CSVエクスポートボタン
   - フィルタリング結果のサムネイル一覧
   - ロゴ検出部位のハイライト表示
   - 検索キーワードのハイライト表示

## 技術スタック
- フロントエンド：Streamlit
- 非同期処理：Celery + Redis
- データベース：SQLite
- ロゴ検出：TorchScript/ONNX Runtime

## 起動方法

### 必要条件
- Docker
- Docker Compose

### 手順
1. リポジトリのクローン
```bash
git clone <リポジトリURL>
cd logo-scraper-app
```

2. Dockerコンテナの起動
```bash
docker-compose up -d
```

3. アプリケーションへのアクセス
ブラウザで以下のURLにアクセスします：
```
http://localhost:8501
```

## 詳細設定
詳細な設定方法については、[設定ガイド.md](設定ガイド.md)を参照してください。

## サンプル設定
以下のサイト用のサンプル設定ファイルが含まれています：
- [メルカリ](config/samples/mercari.json)
- [ヤフオク](config/samples/yahoo_auction.json)

## ディレクトリ構成
```
.
├── app/                  # アプリケーションコード
│   ├── models/           # データベースモデル
│   ├── scrapers/         # スクレイピングモジュール
│   ├── logo_detection/   # ロゴ検出モジュール
│   ├── utils/            # ユーティリティ関数
│   ├── static/           # 静的ファイル
│   ├── templates/        # テンプレート
│   ├── main.py           # メインアプリケーション
│   └── celery_worker.py  # Celeryワーカー
├── config/               # 設定ファイル
│   └── samples/          # サンプル設定
├── data/                 # データファイル（SQLite DB等）
├── tests/                # テストコード
│   └── fixtures/         # テスト用フィクスチャ
├── docker-compose.yml    # Docker Compose設定
├── Dockerfile            # Dockerファイル
├── requirements.txt      # 依存パッケージ
├── README.md             # このファイル
└── 設定ガイド.md          # 設定ガイド
```

## 品質目標
- 初回起動から5分で動作確認可能
- 非技術者でもサイト追加可能なUI
- 検索から結果出力まで10分以内（100商品程度の場合）
