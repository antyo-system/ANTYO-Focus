from datetime import datetime
from math import floor, sqrt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_db, get_current_user
from app.models.pomodoro import PomodoroSession
from app.models.user import User
from app.models.user_progress import UserProgress
from app.schemas.pomodoro import PomodoroSessionRead

router = APIRouter(prefix="/pomodoro", tags=["pomodoro"])

BONUS_XP = 10

def calculate_level(xp: int) -> int:
    return int(floor(sqrt(xp / 10)))


@router.post("/start", response_model=PomodoroSessionRead)
def start_pomodoro(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = PomodoroSession(user_id=current_user.id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/{session_id}/pause", response_model=PomodoroSessionRead)
def pause_pomodoro(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(PomodoroSession).filter(
        PomodoroSession.id == session_id,
        PomodoroSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.is_paused = True
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/{session_id}/stop", response_model=PomodoroSessionRead)
def stop_pomodoro(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(PomodoroSession).filter(
        PomodoroSession.id == session_id,
        PomodoroSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.end_time is None:
        session.end_time = datetime.utcnow()
    session.is_paused = False
    db.add(session)

    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    if not progress:
        progress = UserProgress(user_id=current_user.id, xp=0, level=0)
        db.add(progress)
        db.flush()
    progress.xp += BONUS_XP
    progress.level = calculate_level(progress.xp)
    db.add(progress)
    db.commit()
    db.refresh(session)
    return session
