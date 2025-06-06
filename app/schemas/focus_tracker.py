from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class FocusTrackerBase(BaseModel):
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    session_type: str

class FocusTrackerCreate(FocusTrackerBase):
    pass

class FocusTrackerRead(FocusTrackerBase):
    id: int

    class Config:
        orm_mode = True
