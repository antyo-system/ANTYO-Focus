from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.services.auth_service import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User
from app.schemas.focus_schema import FocusSessionCreate, FocusSessionRead

router = APIRouter(prefix="/focus", tags=["focus quest"])


@router.post("/sessions", response_model=FocusSessionRead)
def create_focus_session(
    session: FocusSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_session = FocusSession(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


@router.get("/sessions", response_model=List[FocusSessionRead])
def read_focus_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(FocusSession).all()
