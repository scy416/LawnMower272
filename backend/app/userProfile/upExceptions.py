from fastapi import HTTPException, status, Request, Session
from app.database.models import User, UserProfile, FriendRequest

def sendRequestExceptions(receiver_id:int, current_user: User, db: Session):
    sender_id = current_user.id
    
    if sender_id == receiver_id:
        raise HTTPException(status_code=400, detail="Can't send request to youself")

    receiver_profile = db.query(UserProfile).filter(UserProfile.user_id == receiver_id).first()
    if receiver_profile in current_user.profile.friends:
        raise HTTPException(status_code=400, detail="Already added as friends")
    
    existing_request = db.query(FriendRequest).filter(
        ((FriendRequest.sender_id == sender_id) & (FriendRequest.receiver_id == receiver_id)) |
        ((FriendRequest.sender_id == receiver_id) & (FriendRequest.receiver_id == sender_id)),
        FriendRequest.status == "pending"
    ).first()

    if existing_request:
        raise HTTPException(status_code=400, detail="A pending request already exists between you two.")

def acceptRequestExceptions(request: FriendRequest, current_user: User):
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if request.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to accept")
    
    if request.status != "pending":
        raise HTTPException(status_code=400, detail="Friend request is not pending") 
    #a bit unnecessary as I delete data from db instead of changing status
