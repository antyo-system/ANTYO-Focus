from datetime import datetime
from uuid import UUID as UUID_t
from pydantic import BaseModel

class UserProgressBase(BaseModel):
    user_id: UUID_t
    xp: int
    level: int
    updated_at: datetime

    class Config:
        orm_mode = True

class UserProgressCreate(BaseModel):
    user_id: UUID_t
    xp: int = 0
    level: int = 0

class UserProgressRead(UserProgressBase):
    id: UUID_t

class AddXPRequest(BaseModel):
    user_id: UUID_t
    amount: int
