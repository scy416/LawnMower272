from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.database.models import User, UserProfile, Conversation
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.social.socialClasses import ConversationResponse

from app.userProfile.friends.friendsMain import is_friend
import app.social.scExceptions as exceptions

router = APIRouter(prefix="/social", tags=['social'])

@router.post("/chat/{target_user_id}", response_model=ConversationResponse)
def make_or_get_conversation(target_user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exceptions.get_convo_exceptions(target_user_id, current_user)

    existing_conv = db.query(Conversation).filter(
        or_(
            and_(Conversation.initiator_id == current_user.id, Conversation.acceptor_id == target_user_id),
            and_(Conversation.initiator_id == target_user_id, Conversation.acceptor_id == current_user.id)
        )
    ).first()

    if existing_conv:
        return {
            "conversation_id": existing_conv.id, 
            "status": existing_conv.status,
            "initiator_id": existing_conv.initiator_id,
            "acceptor_id": existing_conv.acceptor_id
        }

    initial_status = "accepted" if is_friend(current_user, target_user_id, db) else "pending"

    new_conversation = Conversation(
        initiator_id=current_user.id, 
        acceptor_id=target_user_id, 
        status=initial_status
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return {
        "conversation_id": new_conversation.id, 
        "status": new_conversation.status,
        "initiator_id": new_conversation.initiator_id,
        "acceptor_id": new_conversation.acceptor_id
    }

@router.patch("/accept_chat/{conversation_id}")
def accept_conversation_request(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo_request = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    exceptions.accept_convo_exceptions(convo_request, current_user)
    convo_request.status = "accepted"

    db.commit()
    db.refresh(convo_request)
    return {"message": "accepted", "conversation_id": convo_request.id}

@router.delete("/reject_request/{conversation_id}")
def reject_conversation_request(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo_request = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    exceptions.reject_convo_exceptions(convo_request, current_user)

    db.delete(convo_request)
    db.commit()

    return {"message": "rejected"}

@router.get("/discover")
def get_all_other_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    other_profiles = db.query(UserProfile).filter(UserProfile.user_id != current_user.id).all()

    results = []
    for profile in other_profiles:
        results.append({
            "id": profile.user_id,
            "name": profile.user.username,  
            "year": profile.year or 3,      
            "major": profile.major or "Undeclared",
            "bio": profile.bio or "No bio provided.",
            "modules": ["m1", "m2"] 
        })

    return results
