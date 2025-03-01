import streamlit as st
import os
import json
import sys

# Pythonパスの設定
sys.path.append('/app')

from app.models.database import init_db, get_db_session
from app.models.site import Site
from app.models.search_history import SearchHistory
from app.models.result import Result
from app.celery_worker import scrape_sites_task
from app.utils.config import load_config

# アプリケーションの初期化
def init_app():
    # データベースの初期化
    init_db()
    
    # 設定の読み込み
    config = load_config()
    
    # セッションステートの初期化
    if 'search_results' not in st.session_state:
        st.session_state.search_results = []
    if 'current_site' not in st.session_state:
        st.session_state.current_site = None
    if 'task_id' not in st.session_state:
        st.session_state.task_id = None
    if 'progress' not in st.session_state:
        st.session_state.progress = 0
    if 'error_log' not in st.session_state:
        st.session_state.error_log = []

# サイト設定管理ページ
def site_management_page():
    st.header("サイト設定管理")
    
    # サイト一覧の取得
    session = get_db_session()
    sites = session.query(Site).all()
    
    # サイト一覧の表示
    st.subheader("登録済みサイト")
    if sites:
        site_names = [site.name for site in sites]
        selected_site = st.selectbox("サイトを選択", site_names)
        
        # 選択されたサイトの詳細表示
        if selected_site:
            site = session.query(Site).filter(Site.name == selected_site).first()
            st.session_state.current_site = site
            
            with st.expander("サイト詳細", expanded=True):
                st.text(f"URL: {site.url}")
                st.text(f"ロゴ判定閾値: {site.logo_threshold}")
                st.text("スクレイピングセレクタ:")
                st.json(site.selectors)
    else:
        st.info("登録されているサイトはありません。新しいサイトを追加してください。")
    
    # 新規サイト追加フォーム
    st.subheader("新規サイト追加")
    with st.form("new_site_form"):
        name = st.text_input("サイト名")
        url = st.text_input("URL")
        logo_threshold = st.slider("ロゴ判定閾値", 0.0, 1.0, 0.5, 0.01)
        
        # セレクタ設定
        st.subheader("スクレイピングセレクタ")
        search_box = st.text_input("検索ボックスセレクタ", "#searchInput")
        search_button = st.text_input("検索ボタンセレクタ", "#searchButton")
        product_list = st.text_input("商品リストセレクタ", ".items")
        name_selector = st.text_input("商品名セレクタ", ".title")
        price_selector = st.text_input("価格セレクタ", ".price")
        image_selector = st.text_input("画像セレクタ", "img.product_image @src")
        
        submit_button = st.form_submit_button("追加")
        
        if submit_button:
            if name and url:
                # セレクタをJSON形式で保存
                selectors = {
                    "search_box": search_box,
                    "search_button": search_button,
                    "product_list": product_list,
                    "name": name_selector,
                    "price": price_selector,
                    "image": image_selector
                }
                
                # 新規サイトの追加
                new_site = Site(
                    name=name,
                    url=url,
                    logo_threshold=logo_threshold,
                    selectors=json.dumps(selectors)
                )
                
                session.add(new_site)
                session.commit()
                st.success(f"サイト '{name}' が追加されました！")
                st.experimental_rerun()
            else:
                st.error("サイト名とURLは必須です。")
    
    # サイト編集フォーム
    if st.session_state.current_site:
        st.subheader("サイト編集")
        site = st.session_state.current_site
        selectors = json.loads(site.selectors)
        
        with st.form("edit_site_form"):
            name = st.text_input("サイト名", site.name)
            url = st.text_input("URL", site.url)
            logo_threshold = st.slider("ロゴ判定閾値", 0.0, 1.0, site.logo_threshold, 0.01)
            
            # セレクタ設定
            st.subheader("スクレイピングセレクタ")
            search_box = st.text_input("検索ボックスセレクタ", selectors.get("search_box", ""))
            search_button = st.text_input("検索ボタンセレクタ", selectors.get("search_button", ""))
            product_list = st.text_input("商品リストセレクタ", selectors.get("product_list", ""))
            name_selector = st.text_input("商品名セレクタ", selectors.get("name", ""))
            price_selector = st.text_input("価格セレクタ", selectors.get("price", ""))
            image_selector = st.text_input("画像セレクタ", selectors.get("image", ""))
            
            submit_button = st.form_submit_button("更新")
            delete_button = st.form_submit_button("削除", type="secondary")
            
            if submit_button:
                if name and url:
                    # セレクタをJSON形式で保存
                    selectors = {
                        "search_box": search_box,
                        "search_button": search_button,
                        "product_list": product_list,
                        "name": name_selector,
                        "price": price_selector,
                        "image": image_selector
                    }
                    
                    # サイト情報の更新
                    site.name = name
                    site.url = url
                    site.logo_threshold = logo_threshold
                    site.selectors = json.dumps(selectors)
                    
                    session.commit()
                    st.success(f"サイト '{name}' が更新されました！")
                    st.experimental_rerun()
                else:
                    st.error("サイト名とURLは必須です。")
            
            if delete_button:
                session.delete(site)
                session.commit()
                st.session_state.current_site = None
                st.success(f"サイト '{site.name}' が削除されました！")
                st.experimental_rerun()

# 検索ページ
def search_page():
    st.header("キーワード検索")
    
    # サイト一覧の取得
    session = get_db_session()
    sites = session.query(Site).all()
    
    if not sites:
        st.warning("検索を行うには、まずサイト設定を追加してください。")
        return
    
    # サイト選択
    site_names = [site.name for site in sites]
    selected_site = st.selectbox("サイトを選択", site_names)
    site = session.query(Site).filter(Site.name == selected_site).first()
    
    # 検索フォーム
    with st.form("search_form"):
        keywords = st.text_input("検索キーワード（カンマ区切りで複数指定可能）")
        submit_search = st.form_submit_button("検索")
        
        if submit_search and keywords:
            # 検索履歴に保存
            search_history = SearchHistory(keywords=keywords, site_id=site.id)
            session.add(search_history)
            session.commit()
            
            # 検索履歴を10件に制限
            history_count = session.query(SearchHistory).count()
            if history_count > 10:
                oldest_histories = session.query(SearchHistory).order_by(SearchHistory.created_at).limit(history_count - 10)
                for history in oldest_histories:
                    session.delete(history)
                session.commit()
            
            # Celeryタスクの実行
            task = scrape_sites_task.delay(site.id, keywords)
            st.session_state.task_id = task.id
            st.info(f"検索を開始しました。タスクID: {task.id}")
            st.experimental_rerun()
    
    # 検索履歴の表示
    st.subheader("検索履歴")
    histories = session.query(SearchHistory).order_by(SearchHistory.created_at.desc()).limit(10).all()
    if histories:
        for history in histories:
            site_name = session.query(Site.name).filter(Site.id == history.site_id).scalar()
            col1, col2, col3 = st.columns([3, 2, 1])
            with col1:
                st.write(f"キーワード: {history.keywords}")
            with col2:
                st.write(f"サイト: {site_name}")
            with col3:
                if st.button("再検索", key=f"research_{history.id}"):
                    # Celeryタスクの実行
                    task = scrape_sites_task.delay(history.site_id, history.keywords)
                    st.session_state.task_id = task.id
                    st.info(f"検索を開始しました。タスクID: {task.id}")
                    st.experimental_rerun()
    else:
        st.info("検索履歴はありません。")
    
    # タスク進捗の表示
    if st.session_state.task_id:
        st.subheader("処理状況")
        task = scrape_sites_task.AsyncResult(st.session_state.task_id)
        
        if task.state == 'PENDING':
            st.info("タスクを開始しています...")
            st.progress(0)
        elif task.state == 'PROGRESS':
            info = task.info
            st.info(f"処理中: {info.get('status', '')}")
            st.progress(info.get('progress', 0))
            
            # エラーログの表示
            if 'errors' in info and info['errors']:
                st.error("エラーログ:")
                for error in info['errors']:
                    st.write(f"- {error}")
        elif task.state == 'SUCCESS':
            st.success("処理が完了しました！")
            st.progress(100)
            
            # 結果の取得と表示
            result_ids = task.result
            results = session.query(Result).filter(Result.id.in_(result_ids)).all()
            st.session_state.search_results = results
            
            # 結果数の表示
            st.info(f"検索結果: {len(results)}件の商品が見つかりました")
            
            # 結果ページへのリンク
            if st.button("結果を表示"):
                st.session_state.page = "results"
                st.experimental_rerun()
        elif task.state == 'FAILURE':
            st.error("処理中にエラーが発生しました")
            st.error(str(task.result))

# 結果管理ページ
def results_page():
    st.header("検索結果")
    
    session = get_db_session()
    
    # 結果がない場合
    if not st.session_state.search_results:
        st.warning("表示する結果がありません。検索を実行してください。")
        return
    
    # CSVエクスポートボタン
    if st.button("CSVエクスポート"):
        # CSVエクスポート処理
        import pandas as pd
        import io
        
        results = st.session_state.search_results
        data = []
        for result in results:
            data.append({
                "商品名": result.name,
                "価格": result.price,
                "URL": result.url,
                "ロゴ検出": "あり" if result.has_logo else "なし",
                "ロゴ検出スコア": result.logo_score,
                "サイト": session.query(Site.name).filter(Site.id == result.site_id).scalar()
            })
        
        df = pd.DataFrame(data)
        csv = df.to_csv(index=False)
        
        st.download_button(
            label="CSVファイルをダウンロード",
            data=csv,
            file_name="search_results.csv",
            mime="text/csv"
        )
    
    # 結果の表示
    st.subheader("検索結果一覧")
    
    # フィルタリングオプション
    has_logo = st.checkbox("ロゴ検出結果のみ表示")
    
    # 結果のフィルタリング
    results = st.session_state.search_results
    if has_logo:
        results = [r for r in results if r.has_logo]
    
    # 結果の表示
    if results:
        import base64
        from PIL import Image
        import io
        
        # グリッドレイアウトで表示
        cols = st.columns(3)
        for i, result in enumerate(results):
            with cols[i % 3]:
                # 画像の表示
                if result.image_data:
                    try:
                        image_data = base64.b64decode(result.image_data)
                        image = Image.open(io.BytesIO(image_data))
                        st.image(image, caption=result.name, use_column_width=True)
                    except Exception as e:
                        st.error(f"画像の表示エラー: {str(e)}")
                
                # 商品情報の表示
                st.write(f"**{result.name}**")
                st.write(f"価格: {result.price}")
                
                # ロゴ検出結果の表示
                if result.has_logo:
                    st.success(f"ロゴ検出: あり (スコア: {result.logo_score:.2f})")
                    
                    # ロゴ位置のハイライト表示
                    if result.logo_bbox:
                        try:
                            bbox = json.loads(result.logo_bbox)
                            # ハイライト画像の表示処理
                            # 実際の実装ではここでハイライト画像を生成して表示
                        except:
                            pass
                else:
                    st.info("ロゴ検出: なし")
                
                # 商品URLへのリンク
                st.markdown(f"[商品ページを開く]({result.url})")
                
                st.markdown("---")
    else:
        st.info("表示する結果がありません。")

# メイン関数
def main():
    # アプリケーションの初期化
    init_app()
    
    # サイドバーのナビゲーション
    st.sidebar.title("マルチサイトスクレイパー")
    
    # ページ選択
    if 'page' not in st.session_state:
        st.session_state.page = "search"
    
    pages = {
        "検索": "search",
        "サイト設定": "sites",
        "結果管理": "results"
    }
    
    selected_page = st.sidebar.radio("ページ選択", list(pages.keys()))
    st.session_state.page = pages[selected_page]
    
    # ダークモード/ライトモード切替
    theme = st.sidebar.selectbox("テーマ", ["ライトモード", "ダークモード"])
    if theme == "ダークモード":
        st.markdown("""
        <style>
        .stApp {
            background-color: #121212;
            color: white;
        }
        </style>
        """, unsafe_allow_html=True)
    
    # 選択されたページの表示
    if st.session_state.page == "search":
        search_page()
    elif st.session_state.page == "sites":
        site_management_page()
    elif st.session_state.page == "results":
        results_page()
    
    # フッター
    st.sidebar.markdown("---")
    st.sidebar.info("© 2025 マルチサイトスクレイパー")

if __name__ == "__main__":
    main()
