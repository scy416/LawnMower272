from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from email_validator import validate_email, EmailNotValidError

from app.database.database import get_db
from app.database.models import User, UserProfile
from app.auth.authClasses import UserCreate, UserResponse, Token
from app.auth.security import get_password_hash, verify_password, create_access_token
from app.auth import aExceptions
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_email:
        raise exceptions.EmailRepeatedException()

    existing_username = db.query(User).filter(User.username == user_in.username).first()
    if existing_username:
        raise exceptions.UsernameRepeatedException()

    hashed_password = get_password_hash(user_in.password)

    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.flush()
    new_user_profile = UserProfile(user_id = new_user.id)
    db.add(new_user_profile)

    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        validate_email(form_data.username)
        user = db.query(User).filter(User.email == form_data.username).first()
    except EmailNotValidError:
        user = db.query(User).filter(User.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise exceptions.InvalidLoginException()

    access_token = create_access_token(
        subject=user.id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token(access_token=access_token)