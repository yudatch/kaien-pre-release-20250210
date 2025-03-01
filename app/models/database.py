from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import os

# データベースファイルのパス
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'logo_scraper.db')

# SQLAlchemyエンジンの作成
engine = create_engine(f'sqlite:///{DB_PATH}', connect_args={'check_same_thread': False})

# セッションの作成
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

# ベースモデルの作成
Base = declarative_base()

def init_db():
    """データベースの初期化"""
    # データディレクトリの作成
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    # テーブルの作成
    Base.metadata.create_all(engine)

def get_db_session():
    """データベースセッションの取得"""
    return Session()
