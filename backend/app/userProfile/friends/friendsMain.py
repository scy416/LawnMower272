from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.database.models import User, UserProfile
from app.userProfile.friends.friendsClasses import FriendResponse 
from app.userProfile.upExceptions import deleteFriendExceptions

router = APIRouter(prefix="/friends", tags =["friends"])

def is_friend(user: User, other_id: int):
    other_profile = db.query(UserProfile).filter(UserProfile.user_id == other_id).first()
    user_profile = user.profile
    return other_profile in user_profile.friends

@router.get("/friends_list", response_model = List[FriendResponse], status_code=status.HTTP_200_OK)
def get_friends(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friend_profiles = current_user.profile.friends
    friends = [profile.user for profile in friend_profiles]
    return friends

@router.delete("/delete/{friend_id}")
def delete_friend(friend_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_profile = current_user.profile
    friend_profile = db.query(UserProfile).filter(UserProfile.user_id == friend_id).first()

    deleteFriendExceptions(user_profile=user_profile, friend_profile=friend_profile)

    user_profile.friends.remove(friend_profile)
    friend_profile.friends.remove(user_profile)
    db.commit()

    return {"message": "Friend removed"}
