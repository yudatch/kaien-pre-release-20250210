.PHONY: dev prod build build-dev build-prod down clean restart logs dev-with-browser

# 開発環境
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 開発環境（初回ビルド）
build-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# 本番環境
prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d

# 本番環境（初回ビルド）
build-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d --build

# コンテナ停止
down:
	docker compose down

# クリーンアップ（ボリューム含む）
clean:
	docker compose down -v

# 再起動
restart:
	docker compose down
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# ログ表示
logs:
	docker compose logs -f

# 開発環境（ブラウザ付き）
dev-with-browser:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	sleep 5
	open http://localhost:3000