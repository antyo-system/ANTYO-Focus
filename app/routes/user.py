from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func


from app.services.auth_service import get_password_hash
from app.dependencies.auth import get_db, get_current_user


from app.services.auth_service import get_password_hash
from app.dependencies.auth import get_db, get_current_user

from app.services.auth_service import get_db, get_password_hash, get_current_user


from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.focus_tracker import FocusTracker
from app.models.focus_quest import FocusQuest
from app.schemas.user import UserCreate, UserRead, DashboardSummary

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/{user_id}", response_model=UserRead)
def read_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/dashboard/{user_id}", response_model=DashboardSummary)
def dashboard_summary(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    total_xp = progress.xp if progress else 0
    level = progress.level if progress else 0

    total_focus_seconds = db.query(func.sum(func.extract('epoch', FocusTracker.end_time - FocusTracker.start_time)))\
        .filter(FocusTracker.user_id == user_id).scalar() or 0
    total_focus_minutes = float(total_focus_seconds) / 60 if total_focus_seconds else 0.0

    completed_quests = db.query(func.count(FocusQuest.id))\
        .filter(FocusQuest.user_id == user_id, FocusQuest.is_completed == True).scalar() or 0

    return DashboardSummary(
        user_id=user_id,
        total_xp=total_xp,
        level=level,
        total_focus_minutes=total_focus_minutes,
        completed_quests=completed_quests,
    )
