from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.models import User, UserProfile, Module
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.userProfile.profileClasses import ProfileResponse, ProfileUpdate
from app.userProfile.utils import build_profile_response

router = APIRouter(prefix="/profile", tags = ["profile"])

@router.get("/me", response_model = ProfileResponse, status_code = status.HTTP_200_OK)
def get_own_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return build_profile_response(current_user)

@router.get("/{user_id}", response_model = ProfileResponse, status_code = status.HTTP_200_OK)
def get_user_profile(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found.")
    return build_profile_response(target_user)

def update_profile(updated_data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    update_dict = updated_data.model_dump(exclude_unset=True)

    if "modulesTaken" in update_dict or "modulesToTake" in update_dict:
        valid_codes = {m[0] for m in db.query(Module.code).all()}

        if "modulesTaken" in update_dict:
            clean_taken = [mod.replace(" ", "").upper() for mod in update_dict["modulesTaken"]]
            update_dict["modulesTaken"] = [mod for mod in clean_taken if mod in valid_codes]

        if "modulesToTake" in update_dict:
            clean_to_take = [mod.replace(" ", "").upper() for mod in update_dict["modulesToTake"]]
            update_dict["modulesToTake"] = [mod for mod in clean_to_take if mod in valid_codes]

    for field, value in update_dict.items():
        setattr(current_user.profile, field, value)

    db.commit()
    db.refresh(current_user.profile)
    return build_profile_response(current_user)