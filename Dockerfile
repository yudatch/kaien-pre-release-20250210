FROM python:3.10-slim

WORKDIR /app

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコピー
COPY . .

# データディレクトリの作成
RUN mkdir -p /app/data

# Pythonパスの設定
ENV PYTHONPATH=/app

# ポートの公開
EXPOSE 8501

# コマンドの設定（デフォルトはStreamlit）
CMD ["streamlit", "run", "app/main.py"]
