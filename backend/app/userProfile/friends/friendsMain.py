from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.database.models import User, UserProfile, FriendRequest
from app.userProfile.friends.friendsClasses import FriendResponse, FriendRequestResponse
from app.userProfile.upExceptions import deleteFriendExceptions

router = APIRouter(prefix="/friends", tags =["friends"])

def is_friend(user: User, other_id: int, db: Session):
    other_profile = db.query(UserProfile).filter(UserProfile.user_id == other_id).first()

    if not other_profile:
        return False
    
    user_profile = user.profile
    return other_profile in user_profile.friends

@router.get("/friends_list", response_model = List[FriendResponse], status_code=status.HTTP_200_OK)
def get_friends(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friend_profiles = current_user.profile.friends
    friends = [profile.user for profile in friend_profiles]
    return friends

@router.get("/requests/pending", response_model=List[FriendRequestResponse], status_code=status.HTTP_200_OK)
def get_pending_requests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pending = db.query(FriendRequest).filter(
        FriendRequest.receiver_id == current_user.id,
        FriendRequest.status == "pending"
    ).all()
    return [
        FriendRequestResponse(
            request_id=req.id,
            sender_id=req.sender_id,
            sender_username=db.query(User).filter(User.id == req.sender_id).first().username
        )
        for req in pending
    ]

@router.get("/requests/sent", status_code=status.HTTP_200_OK)
def get_sent_requests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sent = db.query(FriendRequest).filter(
        FriendRequest.sender_id == current_user.id,
        FriendRequest.status == "pending"
    ).all()
    return [{"receiver_id": req.receiver_id} for req in sent]


@router.delete("/delete/{friend_id}")
def delete_friend(friend_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_profile = current_user.profile
    friend_profile = db.query(UserProfile).filter(UserProfile.user_id == friend_id).first()

    deleteFriendExceptions(user_profile=user_profile, friend_profile=friend_profile)

    user_profile.friends.remove(friend_profile)
    friend_profile.friends.remove(user_profile)
    db.commit()

    return {"message": "Friend removed"}
