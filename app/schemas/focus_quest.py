from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class FocusQuestBase(BaseModel):
    user_id: int
    title: str
    description: Optional[str] = None
    is_completed: bool = False


class FocusQuestCreate(FocusQuestBase):
    pass


class FocusQuestRead(FocusQuestBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
