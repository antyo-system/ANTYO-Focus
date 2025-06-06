from sqlalchemy import Column, Integer, DateTime, Boolean
from app.database import Base
import datetime


class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    is_paused = Column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"<PomodoroSession(id={self.id}, user_id={self.user_id})>"
