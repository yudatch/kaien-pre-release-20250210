import requests
import json
import base64
import time
import random
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from urllib.parse import urljoin, quote

class Scraper:
    """
    Webサイトスクレイピングクラス
    """
    def __init__(self, site):
        """
        初期化
        
        Args:
            site: サイト設定モデル
        """
        self.site = site
        self.url = site.url
        self.selectors = json.loads(site.selectors)
        self.user_agent = UserAgent()
        self.session = requests.Session()
    
    def get_headers(self):
        """
        ランダムなUser-Agentを含むヘッダーを生成
        """
        return {
            'User-Agent': self.user_agent.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
        }
    
    def search(self, keyword):
        """
        キーワードで検索を実行
        
        Args:
            keyword: 検索キーワード
            
        Returns:
            list: 商品情報のリスト
        """
        # キーワードのエンコード（UTF-8とShift_JISの両方に対応）
        try:
            # まずUTF-8でエンコード
            encoded_keyword = quote(keyword)
            
            # 検索ページにアクセス
            response = self._get_with_retry(self.url)
            if not response:
                return []
            
            soup = BeautifulSoup(response.text, 'lxml')
            
            # 検索ボックスと検索ボタンを探す
            search_box = soup.select_one(self.selectors.get('search_box', '#searchInput'))
            search_button = soup.select_one(self.selectors.get('search_button', '#searchButton'))
            
            if not search_box or not search_button:
                # 検索フォームが見つからない場合は直接検索URLを構築
                search_url = f"{self.url}/search?q={encoded_keyword}"
                response = self._get_with_retry(search_url)
            else:
                # 検索フォームを使用して検索
                form = search_box.find_parent('form')
                if form:
                    # フォームのaction属性からURLを取得
                    action = form.get('action', '')
                    method = form.get('method', 'get').lower()
                    
                    # 検索パラメータの構築
                    params = {}
                    for input_tag in form.find_all('input'):
                        if input_tag.get('name'):
                            params[input_tag.get('name')] = input_tag.get('value', '')
                    
                    # 検索ボックスの名前を特定
                    search_box_name = search_box.get('name', 'q')
                    params[search_box_name] = keyword
                    
                    # 検索リクエストの送信
                    search_url = urljoin(self.url, action)
                    if method == 'post':
                        response = self._post_with_retry(search_url, data=params)
                    else:
                        response = self._get_with_retry(search_url, params=params)
                else:
                    # フォームが見つからない場合は直接検索URLを構築
                    search_url = f"{self.url}/search?q={encoded_keyword}"
                    response = self._get_with_retry(search_url)
            
            if not response:
                return []
            
            # 検索結果ページから商品情報を抽出
            return self._extract_products(response.text, keyword)
            
        except Exception as e:
            print(f"検索中にエラーが発生しました: {str(e)}")
            return []
    
    def _extract_products(self, html, keyword):
        """
        HTML から商品情報を抽出
        
        Args:
            html: HTML文字列
            keyword: 検索キーワード
            
        Returns:
            list: 商品情報のリスト
        """
        products = []
        soup = BeautifulSoup(html, 'lxml')
        
        # 商品リストの取得
        product_list = soup.select(self.selectors.get('product_list', '.items'))
        
        if not product_list:
            return []
        
        # 各商品の情報を抽出
        for item in product_list:
            try:
                # 商品名
                name_elem = item.select_one(self.selectors.get('name', '.title'))
                name = name_elem.get_text().strip() if name_elem else "不明"
                
                # 価格
                price_elem = item.select_one(self.selectors.get('price', '.price'))
                price = price_elem.get_text().strip() if price_elem else "不明"
                
                # 画像URL
                image_selector = self.selectors.get('image', 'img.product_image')
                attr = None
                
                # 属性の抽出（例: img.product_image @src）
                if ' @' in image_selector:
                    image_selector, attr = image_selector.split(' @')
                
                image_elem = item.select_one(image_selector)
                image_url = ""
                
                if image_elem:
                    if attr:
                        image_url = image_elem.get(attr, '')
                    else:
                        # デフォルトはsrc属性
                        image_url = image_elem.get('src', '')
                        if not image_url:
                            image_url = image_elem.get('data-src', '')
                
                # 商品URL
                url = ""
                link_elem = item.select_one('a')
                if link_elem and link_elem.has_attr('href'):
                    url = urljoin(self.url, link_elem['href'])
                
                # キーワードが商品名に含まれているかチェック
                if keyword.lower() in name.lower():
                    products.append({
                        'name': name,
                        'price': price,
                        'image_url': image_url,
                        'url': url
                    })
            except Exception as e:
                print(f"商品情報の抽出中にエラーが発生しました: {str(e)}")
                continue
        
        return products
    
    def download_image(self, image_url):
        """
        画像をダウンロードしてBase64エンコードで返す
        
        Args:
            image_url: 画像のURL
            
        Returns:
            str: Base64エンコードされた画像データ
        """
        if not image_url:
            return None
        
        try:
            # 画像のダウンロード
            response = self._get_with_retry(image_url)
            if not response or response.status_code != 200:
                return None
            
            # Base64エンコード
            image_data = base64.b64encode(response.content).decode('utf-8')
            return image_data
        except Exception as e:
            print(f"画像のダウンロード中にエラーが発生しました: {str(e)}")
            return None
    
    def _get_with_retry(self, url, params=None, max_retries=3):
        """
        GETリクエストをリトライ機構付きで実行
        
        Args:
            url: リクエスト先URL
            params: GETパラメータ
            max_retries: 最大リトライ回数
            
        Returns:
            Response: レスポンスオブジェクト
        """
        for i in range(max_retries):
            try:
                # 動的待機時間
                if i > 0:
                    time.sleep(random.uniform(1, 3))
                
                response = self.session.get(
                    url,
                    params=params,
                    headers=self.get_headers(),
                    timeout=30
                )
                return response
            except Exception as e:
                print(f"GETリクエスト中にエラーが発生しました (リトライ {i+1}/{max_retries}): {str(e)}")
                if i == max_retries - 1:
                    return None
    
    def _post_with_retry(self, url, data=None, max_retries=3):
        """
        POSTリクエストをリトライ機構付きで実行
        
        Args:
            url: リクエスト先URL
            data: POSTデータ
            max_retries: 最大リトライ回数
            
        Returns:
            Response: レスポンスオブジェクト
        """
        for i in range(max_retries):
            try:
                # 動的待機時間
                if i > 0:
                    time.sleep(random.uniform(1, 3))
                
                response = self.session.post(
                    url,
                    data=data,
                    headers=self.get_headers(),
                    timeout=30
                )
                return response
            except Exception as e:
                print(f"POSTリクエスト中にエラーが発生しました (リトライ {i+1}/{max_retries}): {str(e)}")
                if i == max_retries - 1:
                    return None
