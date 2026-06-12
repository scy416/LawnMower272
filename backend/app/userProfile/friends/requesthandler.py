from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.database.models import User, UserProfile, FriendRequest

router = APIRouter(prefix="/friends/requests", tags=["requests"])

@router.post("/send")
def send_friend_request(receiver_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sender_id = current_user.id
    #exceptions to handle
    # 1. Prevent sending a request to yourself
    # 2. Check if they are already friends
    # 3. Check if a request is already pending (either direction)
    new_friend_request = FriendRequest(sender_id, receiver_id, "pending")
    db.add(new_friend_request)
    db.commit()

    return {"message": "Friend request sent!"}

@router.post("/accept")
def accept_friend_request(request_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friend_request = db.query(FriendRequest).filter(FriendRequest.id == request_id).findFirst()
    sender_profile = db.query(UserProfile).filter(UserProfile.user.id == friend_request.sender_id).findFirst()

    sender_profile.append(current_user.profile)
    return 