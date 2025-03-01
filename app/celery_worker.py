from celery import Celery
from celery.signals import task_prerun, task_postrun, task_failure
import os
import time
import json
import sys

# Pythonパスの設定
sys.path.append('/app')

from app.models.database import get_db_session
from app.models.site import Site
from app.models.result import Result

# Celeryの設定
redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = os.environ.get('REDIS_PORT', '6379')
app = Celery('logo_scraper', 
             broker=f'redis://{redis_host}:{redis_port}/0',
             backend=f'redis://{redis_host}:{redis_port}/0')

# Celeryの設定
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Tokyo',
    enable_utc=True,
    worker_max_tasks_per_child=200,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_track_started=True
)

# リトライ設定
app.conf.task_default_retry_delay = 5  # 5秒後にリトライ
app.conf.task_max_retries = 3  # 最大3回リトライ

# スクレイピングタスク
@app.task(bind=True)
def scrape_sites_task(self, site_id, keywords):
    """
    サイトのスクレイピングとロゴ検出を行うタスク
    """
    from app.scrapers.scraper import Scraper
    from app.logo_detection.detector import LogoDetector
    
    # タスク開始時の状態更新
    self.update_state(state='PROGRESS', meta={
        'progress': 0,
        'status': 'スクレイピングを開始しています...',
        'errors': []
    })
    
    session = get_db_session()
    site = session.query(Site).filter(Site.id == site_id).first()
    
    if not site:
        self.update_state(state='FAILURE', meta={
            'status': 'サイトが見つかりません',
            'errors': ['指定されたサイトIDが存在しません']
        })
        return None
    
    # キーワードの分割
    keyword_list = [k.strip() for k in keywords.split(',') if k.strip()]
    
    # スクレイパーとロゴ検出器の初期化
    scraper = Scraper(site)
    detector = LogoDetector(threshold=site.logo_threshold)
    
    # エラーログ
    errors = []
    
    # 結果ID一覧
    result_ids = []
    
    try:
        # スクレイピング実行
        self.update_state(state='PROGRESS', meta={
            'progress': 10,
            'status': 'サイトからデータを取得しています...',
            'errors': errors
        })
        
        # 商品一覧の取得
        products = []
        for i, keyword in enumerate(keyword_list):
            try:
                keyword_products = scraper.search(keyword)
                products.extend(keyword_products)
                
                # 進捗状況の更新
                progress = 10 + int(40 * (i + 1) / len(keyword_list))
                self.update_state(state='PROGRESS', meta={
                    'progress': progress,
                    'status': f'キーワード "{keyword}" の検索結果を取得中... ({len(keyword_products)}件)',
                    'errors': errors
                })
            except Exception as e:
                errors.append(f'キーワード "{keyword}" の検索中にエラーが発生しました: {str(e)}')
                # エラーがあっても続行
        
        # 商品が見つからない場合
        if not products:
            self.update_state(state='SUCCESS', meta={
                'progress': 100,
                'status': '商品が見つかりませんでした',
                'errors': errors
            })
            return []
        
        # ロゴ検出処理
        self.update_state(state='PROGRESS', meta={
            'progress': 50,
            'status': 'ロゴ検出処理を実行中...',
            'errors': errors
        })
        
        # 商品ごとにロゴ検出を実行
        for i, product in enumerate(products):
            try:
                # 画像のダウンロードとロゴ検出
                image_data = scraper.download_image(product['image_url'])
                if image_data:
                    has_logo, logo_score, logo_bbox = detector.detect_logo(image_data)
                    
                    # 結果の保存
                    result = Result(
                        name=product['name'],
                        price=product['price'],
                        url=product['url'],
                        image_data=image_data,
                        has_logo=has_logo,
                        logo_score=logo_score,
                        logo_bbox=json.dumps(logo_bbox) if logo_bbox else None,
                        site_id=site_id
                    )
                    
                    session.add(result)
                    session.commit()
                    result_ids.append(result.id)
                
                # 進捗状況の更新
                progress = 50 + int(50 * (i + 1) / len(products))
                self.update_state(state='PROGRESS', meta={
                    'progress': progress,
                    'status': f'ロゴ検出処理中... ({i+1}/{len(products)})',
                    'errors': errors
                })
            except Exception as e:
                errors.append(f'商品 "{product["name"]}" のロゴ検出中にエラーが発生しました: {str(e)}')
                # エラーがあっても続行
        
        # 処理完了
        self.update_state(state='SUCCESS', meta={
            'progress': 100,
            'status': '処理が完了しました',
            'errors': errors
        })
        
        return result_ids
    
    except Exception as e:
        errors.append(f'処理中に予期せぬエラーが発生しました: {str(e)}')
        self.update_state(state='FAILURE', meta={
            'status': '処理中にエラーが発生しました',
            'errors': errors
        })
        # 例外を再発生させてリトライを促す
        raise
