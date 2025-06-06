from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
import datetime

class FocusTracker(Base):
    __tablename__ = "focus_trackers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    session_type = Column(String, nullable=False)

    def __repr__(self):
        return f"<FocusTracker(id={self.id}, type={self.session_type})>"
