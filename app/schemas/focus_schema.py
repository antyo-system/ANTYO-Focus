from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class FocusSessionBase(BaseModel):
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: Optional[float] = None
    description: Optional[str] = None


class FocusSessionCreate(FocusSessionBase):
    pass


class FocusSessionRead(FocusSessionBase):
    id: int

    class Config:
        orm_mode = True
