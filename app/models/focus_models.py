from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

# Contoh: Tracking waktu fokus per sesi
class FocusSession(Base):
    __tablename__ = 'focus_sessions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # nanti bisa dihubungkan ke table user kalau ada
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Float, nullable=True)
    description = Column(String, nullable=True)

    def __repr__(self):
        return f"<FocusSession(id={self.id}, start_time={self.start_time}, duration={self.duration_minutes})>"
