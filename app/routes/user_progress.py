from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from math import floor, sqrt


from app.dependencies.auth import get_db, get_current_user
from app.models.user_progress import UserProgress
from app.models.user import User


from app.dependencies.auth import get_db, get_current_user
from app.models.user_progress import UserProgress
from app.models.user import User


from app.services.auth_service import get_db, get_current_user
from app.models.user_progress import UserProgress
from app.models.user import User

from app.database import SessionLocal
from app.models.user_progress import UserProgress



from app.schemas.user_progress import UserProgressCreate, UserProgressRead, AddXPRequest

router = APIRouter(prefix="/progress", tags=["user progress"])



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




def calculate_level(xp: int) -> int:
    return int(floor(sqrt(xp / 10)))


@router.get("/{user_id}", response_model=UserProgressRead)

def get_progress(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

def get_progress(user_id: str, db: Session = Depends(get_db)):



    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return progress


@router.post("/add-xp", response_model=UserProgressRead)

def add_xp(
    payload: AddXPRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

def add_xp(payload: AddXPRequest, db: Session = Depends(get_db)):



    progress = db.query(UserProgress).filter(UserProgress.user_id == payload.user_id).first()
    if not progress:
        progress = UserProgress(user_id=payload.user_id, xp=0, level=0)
        db.add(progress)
        db.flush()
    progress.xp += payload.amount
    progress.level = calculate_level(progress.xp)
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress
