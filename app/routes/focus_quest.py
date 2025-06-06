from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.auth_service import get_db, get_current_user
from app.models.focus_quest import FocusQuest
from app.models.user import User
from app.schemas.focus_quest import FocusQuestCreate, FocusQuestRead

router = APIRouter(prefix="/quests", tags=["focus quest"])


@router.post("/", response_model=FocusQuestRead)
def create_focus_quest(
    quest: FocusQuestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
    return db.query(FocusQuest).all()


@router.get("/{quest_id}", response_model=FocusQuestRead)
def read_focus_quest(
    quest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quest = db.query(FocusQuest).filter(FocusQuest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="FocusQuest not found")
    return quest
