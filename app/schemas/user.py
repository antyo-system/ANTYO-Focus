from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str | None = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: str

    class Config:
        orm_mode = True

class DashboardSummary(BaseModel):
    user_id: str
    total_xp: int
    level: int
    total_focus_minutes: float
    completed_quests: int


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str | None = None
