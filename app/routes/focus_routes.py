
from typing import List, Generator
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.focus_models import FocusSession
from app.models.user import User
from app.schemas.focus_schema import FocusSessionCreate, FocusSessionRead

from app.dependencies.auth import get_current_user


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from app.dependencies.auth import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User

from app.dependencies.auth import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User

from app.dependencies.auth import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User

from app.dependencies.auth import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User


from app.dependencies.auth import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User

from app.dependencies.auth import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User

from app.services.auth_service import get_db, get_current_user
from app.models.focus_models import FocusSession
from app.models.user import User

from app.database import SessionLocal
from app.models.focus_models import FocusSession





from app.schemas.focus_schema import FocusSessionCreate, FocusSessionRead


router = APIRouter(prefix="/focus", tags=["focus quest"])


@router.post("/sessions", response_model=FocusSessionRead)
def create_focus_session(
    session: FocusSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/sessions", response_model=FocusSessionRead)
def create_focus_session(session: FocusSessionCreate, db: Session = Depends(get_db)):




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

def read_focus_sessions(db: Session = Depends(get_db)):





    return db.query(FocusSession).all()
