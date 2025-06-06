from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database import Base
import datetime

class FocusQuest(Base):
    __tablename__ = "focus_quests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<FocusQuest(id={self.id}, title={self.title})>"
