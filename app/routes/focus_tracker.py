from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from app.dependencies.auth import get_db, get_current_user
from app.models.focus_tracker import FocusTracker
from app.models.user import User


from app.dependencies.auth import get_db, get_current_user
from app.models.focus_tracker import FocusTracker
from app.models.user import User


from app.services.auth_service import get_db, get_current_user
from app.models.focus_tracker import FocusTracker
from app.models.user import User

from app.database import SessionLocal
from app.models.focus_tracker import FocusTracker


from app.schemas.focus_tracker import FocusTrackerCreate, FocusTrackerRead

router = APIRouter(prefix="/tracker", tags=["focus tracker"])



@router.post("/", response_model=FocusTrackerRead)
def create_tracker(
    entry: FocusTrackerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=FocusTrackerRead)
def create_tracker(entry: FocusTrackerCreate, db: Session = Depends(get_db)):



    db_entry = FocusTracker(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.get("/", response_model=List[FocusTrackerRead])

def read_trackers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):


def read_trackers(db: Session = Depends(get_db)):


    return db.query(FocusTracker).all()
