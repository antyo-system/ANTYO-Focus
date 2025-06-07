from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PomodoroSessionBase(BaseModel):
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    is_paused: bool = False


class PomodoroSessionCreate(PomodoroSessionBase):
    pass


class PomodoroSessionRead(PomodoroSessionBase):
    id: int

    class Config:
        orm_mode = True
