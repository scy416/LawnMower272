from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.userProfile.profileClasses import FriendResponse 

router = APIRouter(prefix="/profile/friends", tags =["friends"])

@router.get("/friends_list", response_model = List[FriendResponse], status_code=status.HTTP_200_OK)
def get_friends(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friends = current_user.profile.friends
    return friends
