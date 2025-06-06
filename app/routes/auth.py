from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserRead, Token
from app.services.auth_service import (
    get_password_hash,
    authenticate_user,
    create_access_token,

)
from app.dependencies.auth import get_db



)
from app.dependencies.auth import get_db



)
from app.dependencies.auth import get_db


)
from app.dependencies.auth import get_db

    get_db,
)





router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
