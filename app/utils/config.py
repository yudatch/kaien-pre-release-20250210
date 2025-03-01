import os
import json

def load_config():
    """
    設定ファイルの読み込み
    """
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'config.json')
    
    # 設定ファイルが存在しない場合はデフォルト設定を作成
    if not os.path.exists(config_path):
        default_config = {
            "app_name": "マルチサイトスクレイパー",
            "version": "1.0.0",
            "max_search_history": 10,
            "default_logo_threshold": 0.5,
            "retry_count": 3,
            "auto_delay": True
        }
        
        # 設定ディレクトリの作成
        os.makedirs(os.path.dirname(config_path), exist_ok=True)
        
        # デフォルト設定の保存
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, ensure_ascii=False, indent=2)
        
        return default_config
    
    # 設定ファイルの読み込み
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        return config
    except Exception as e:
        print(f"設定ファイルの読み込み中にエラーが発生しました: {str(e)}")
        return {}

def save_config(config):
    """
    設定ファイルの保存
    """
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'config.json')
    
    # 設定ディレクトリの作成
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    
    # 設定の保存
    try:
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"設定ファイルの保存中にエラーが発生しました: {str(e)}")
        return False
