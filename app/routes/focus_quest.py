from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from app.dependencies.auth import get_db, get_current_user
from app.models.focus_quest import FocusQuest
from app.models.user import User
from app.schemas.focus_quest import FocusQuestCreate, FocusQuestRead

router = APIRouter(prefix="/quests", tags=["focus quest"])




from app.services.auth_service import get_db, get_current_user
from app.models.focus_quest import FocusQuest
from app.models.user import User
from app.database import SessionLocal
from app.models.focus_quest import FocusQuest
from app.schemas.focus_quest import FocusQuestCreate, FocusQuestRead
router = APIRouter(prefix="/quests", tags=["focus quest"])







@router.post("/", response_model=FocusQuestRead)
def create_focus_quest(
    quest: FocusQuestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=FocusQuestRead)
def create_focus_quest(quest: FocusQuestCreate, db: Session = Depends(get_db)):


    db_quest = FocusQuest(**quest.dict())
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)
    return db_quest


@router.get("/", response_model=List[FocusQuestRead])

def read_focus_quests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

def read_focus_quests(db: Session = Depends(get_db)):





    return db.query(FocusQuest).all()


@router.get("/{quest_id}", response_model=FocusQuestRead)

def read_focus_quest(
    quest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):


def read_focus_quest(quest_id: int, db: Session = Depends(get_db)):



    quest = db.query(FocusQuest).filter(FocusQuest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="FocusQuest not found")
    return quest
