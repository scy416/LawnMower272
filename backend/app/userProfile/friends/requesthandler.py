from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.database.models import User, UserProfile, FriendRequest
from app.userProfile.upExceptions import sendRequestExceptions, acceptRequestExceptions

router = APIRouter(prefix="/friends/requests", tags=["requests"])

@router.post("/send/{receiver_id}")
def send_friend_request(receiver_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sender_id = current_user.id

    sendRequestExceptions(receiver_id, current_user, db)

    new_friend_request = FriendRequest(sender_id = sender_id, receiver_id = receiver_id, status = "pending")
    db.add(new_friend_request)
    db.commit()

    return {"message": "Friend request sent!"}

@router.post("/accept/{request_id}")
def accept_friend_request(request_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friend_request = db.query(FriendRequest).filter(FriendRequest.id == request_id).first()
    
    acceptRequestExceptions(friend_request, current_user)

    sender_profile = db.query(UserProfile).filter(UserProfile.user_id == friend_request.sender_id).first()
    receiver_profile = current_user.profile

    sender_profile.friends.append(receiver_profile)
    receiver_profile.friends.append(sender_profile)
    db.delete(friend_request)
    db.commit()

    return {"message": "Friend request accepted!"}

@router.delete("/reject/{request_id}")
def reject_friend_request(request_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friend_request = db.query(FriendRequest).filter(FriendRequest.id == request_id).first()

    if not friend_request:
        raise HTTPException(status_code=404, detail="Friend request not found.")
    if friend_request.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only reject requests sent to you.")

    db.delete(friend_request)
    db.commit()

    return {"message": "Friend request rejected."}