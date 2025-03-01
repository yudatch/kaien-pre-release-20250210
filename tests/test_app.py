import os
import sys
import json
import unittest
import base64
from unittest.mock import patch, MagicMock

# アプリケーションのパスを追加
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import init_db, get_db_session, Base, engine
from app.models.site import Site
from app.models.result import Result
from app.scrapers.scraper import Scraper
from app.logo_detection.detector import LogoDetector

class TestLogoScraperApp(unittest.TestCase):
    """アプリケーションのテストクラス"""
    
    @classmethod
    def setUpClass(cls):
        """テスト開始前の準備"""
        # テスト用データベースの初期化
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        
        # テスト用サイトの登録
        cls.session = get_db_session()
        
        # テスト用サイト1
        with open('tests/fixtures/mock_site.json', 'r') as f:
            site_data = json.load(f)
        
        site1 = Site(
            name=site_data['name'],
            url=site_data['url'],
            logo_threshold=site_data['logo_threshold'],
            selectors=json.dumps(site_data['selectors'])
        )
        cls.session.add(site1)
        
        # テスト用サイト2（メルカリ）
        with open('config/samples/mercari.json', 'r') as f:
            site_data = json.load(f)
        
        site2 = Site(
            name=site_data['name'],
            url=site_data['url'],
            logo_threshold=site_data['logo_threshold'],
            selectors=json.dumps(site_data['selectors'])
        )
        cls.session.add(site2)
        
        # テスト用サイト3（ヤフオク）
        with open('config/samples/yahoo_auction.json', 'r') as f:
            site_data = json.load(f)
        
        site3 = Site(
            name=site_data['name'],
            url=site_data['url'],
            logo_threshold=site_data['logo_threshold'],
            selectors=json.dumps(site_data['selectors'])
        )
        cls.session.add(site3)
        
        cls.session.commit()
    
    @classmethod
    def tearDownClass(cls):
        """テスト終了後のクリーンアップ"""
        cls.session.close()
    
    def test_site_model(self):
        """サイトモデルのテスト"""
        sites = self.session.query(Site).all()
        self.assertEqual(len(sites), 3)
        
        # サイト名の確認
        site_names = [site.name for site in sites]
        self.assertIn("テストサイト", site_names)
        self.assertIn("メルカリ", site_names)
        self.assertIn("ヤフオク", site_names)
    
    def test_logo_detector_mock_mode(self):
        """ロゴ検出器のモックモードテスト"""
        detector = LogoDetector(threshold=0.5, mock=True)
        
        # ダミー画像データ
        dummy_image = base64.b64encode(b"dummy_image_data").decode('utf-8')
        
        # 100回テストを実行して、約50%の確率でロゴが検出されることを確認
        logo_count = 0
        total_tests = 100
        
        for _ in range(total_tests):
            has_logo, score, bbox = detector.detect_logo(dummy_image)
            if has_logo:
                logo_count += 1
                self.assertGreaterEqual(score, 0.5)  # 閾値以上のスコア
                self.assertIsNotNone(bbox)  # バウンディングボックスが存在
            else:
                self.assertLess(score, 0.5)  # 閾値未満のスコア
                self.assertIsNone(bbox)  # バウンディングボックスが存在しない
        
        # 検出率が30%〜70%の範囲内であることを確認（統計的なばらつきを考慮）
        detection_rate = logo_count / total_tests
        self.assertGreaterEqual(detection_rate, 0.3)
        self.assertLessEqual(detection_rate, 0.7)
    
    @patch('app.scrapers.scraper.Scraper._get_with_retry')
    def test_scraper_with_special_characters(self, mock_get):
        """特殊文字を含む検索キーワードのテスト"""
        # モックレスポンスの設定
        mock_response = MagicMock()
        mock_response.text = """
        <html>
            <body>
                <div class="product-item">
                    <h2 class="product-name">特殊文字テスト商品 #$%&</h2>
                    <div class="product-price">1,980円</div>
                    <div class="product-image"><img src="https://example.com/image1.jpg"></div>
                    <a href="/product1">詳細</a>
                </div>
            </body>
        </html>
        """
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        
        # テスト用サイトの取得
        site = self.session.query(Site).filter(Site.name == "テストサイト").first()
        
        # スクレイパーの初期化
        scraper = Scraper(site)
        
        # 特殊文字を含む検索キーワード
        special_chars = [
            "テスト #$%&",
            "マルチバイト文字 あいうえお",
            "英語+日本語 test テスト",
            "記号!@#$%^&*()",
            "絵文字😀🔍📱"
        ]
        
        for keyword in special_chars:
            products = scraper.search(keyword)
            self.assertGreaterEqual(len(products), 0)
    
    def test_performance(self):
        """パフォーマンステスト"""
        import time
        
        # テスト用サイトの取得
        site = self.session.query(Site).filter(Site.name == "テストサイト").first()
        
        # テスト用の商品データ
        with open('tests/fixtures/mock_products.json', 'r') as f:
            mock_products = json.load(f)
        
        # ロゴ検出器の初期化（モックモード）
        detector = LogoDetector(threshold=0.5, mock=True)
        
        # 処理時間の計測
        start_time = time.time()
        
        # 100商品の処理をシミュレート
        for i in range(100):
            # 商品データのコピー
            product = mock_products[i % len(mock_products)].copy()
            product['name'] = f"{product['name']} {i}"
            
            # ロゴ検出処理
            has_logo, logo_score, logo_bbox = detector.detect_logo("dummy_image_data")
            
            # 結果の保存
            result = Result(
                name=product['name'],
                price=product['price'],
                url=product['url'],
                image_data="dummy_image_data",
                has_logo=has_logo,
                logo_score=logo_score,
                logo_bbox=json.dumps(logo_bbox) if logo_bbox else None,
                site_id=site.id
            )
            
            self.session.add(result)
        
        self.session.commit()
        
        # 処理時間の確認
        elapsed_time = time.time() - start_time
        print(f"100商品の処理時間: {elapsed_time:.2f}秒")
        
        # 10分以内（600秒）で処理が完了することを確認
        self.assertLess(elapsed_time, 600)

if __name__ == '__main__':
    unittest.main()
