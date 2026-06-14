from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.database.models import User, UserProfile
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.userProfile.profileClasses import ProfileResponse, ProfileUpdate
from app.userProfile.utils import build_profile_response

router = APIRouter(prefix="/profile", tags = ["profile"])

@router.get("/me", response_model = ProfileResponse, status_code = status.HTTP_200_OK)
def get_own_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return build_profile_response(current_user)

@router.patch("/me", response_model = ProfileResponse, status_code= status.HTTP_200_OK)
def update_profile(updated_data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(current_user.profile, field, value)

    db.commit()
    db.refresh(current_user.profile)
    return build_profile_response(current_user)
