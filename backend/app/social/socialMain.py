from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.database.models import User, UserProfile, Conversation, Messages
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.social.socialClasses import ConversationResponse

from app.userProfile.friends.friendsMain import is_friend

router = APIRouter(prefix="/social", tags=['social'])

@router.post("/chat/{target_user_id}", response_model=ConversationResponse)
def make_or_get_conversation(target_user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing_conv = db.query(Conversation).filter(
        or_(
            and_(Conversation.initiator_id == current_user.id, Conversation.acceptor_id == target_user_id),
            and_(Conversation.initiator_id == target_user_id, Conversation.acceptor_id == current_user.id)
        )
    ).first()

    if existing_conv:
        return {"conversation_id": existing_conv.id, "status": existing_conv.status}

    initial_status = "accepted" if is_friends(current_user, target_user_id) else "pending"

    new_conversation = Conversation(initiator_id=current_user.id, receiver_id=target_user_id, status = initial_status)

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return {"conversation_id": new_conv.id, "status": new_conv.status}

@router.patch("/accept_chat/{conversation_id}")
def accept_conversation_request(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo_request = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    convo_request.status = "accepted"

    db.commit()
    db.refresh(convo_request)
    return {"message": "accepted", "conversation_id": convo_request.id}

@router.delete("/delete_request/{conversation_id}")
def delete_conversation_request(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo_request = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    
    db.delete(convo_request)
    db.commit()

    return {"message": "deleted"}
