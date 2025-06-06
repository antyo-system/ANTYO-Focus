from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True

class DashboardSummary(BaseModel):
    user_id: int
    total_xp: int
    level: int
    total_focus_minutes: float
    completed_quests: int
