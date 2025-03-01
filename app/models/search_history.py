from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.models.database import Base

class SearchHistory(Base):
    """検索履歴モデル"""
    __tablename__ = 'search_history'
    
    id = Column(Integer, primary_key=True)
    keywords = Column(String, nullable=False)
    site_id = Column(Integer, ForeignKey('sites.id'), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    def __repr__(self):
        return f"<SearchHistory(id={self.id}, keywords='{self.keywords}')>"
