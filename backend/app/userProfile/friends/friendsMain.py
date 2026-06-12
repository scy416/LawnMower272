from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.userProfile.friends.friendsClasses import FriendResponse 

router = APIRouter(prefix="/friends", tags =["friends"])

@router.get("/friends_list", response_model = List[FriendResponse], status_code=status.HTTP_200_OK)
def get_friends(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friend_profiles = current_user.profile.friends
    friends = [profile.user for profile in friend_profiles]
    return friends

