from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.models.database import Base

class Site(Base):
    """サイト設定モデル"""
    __tablename__ = 'sites'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    url = Column(String, nullable=False)
    logo_threshold = Column(Float, default=0.5)
    selectors = Column(String, nullable=False)  # JSON形式で保存
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Site(id={self.id}, name='{self.name}')>"
