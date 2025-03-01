from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.models.database import Base

class Result(Base):
    """検索結果モデル"""
    __tablename__ = 'results'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(String)
    url = Column(String)
    image_data = Column(Text)  # Base64エンコードされた画像データ
    has_logo = Column(Boolean, default=False)
    logo_score = Column(Float, default=0.0)
    logo_bbox = Column(String)  # JSON形式で保存 [x, y, width, height]
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    def __repr__(self):
        return f"<Result(id={self.id}, name='{self.name}', has_logo={self.has_logo})>"
