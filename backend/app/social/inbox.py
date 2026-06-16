from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc

from app.database.models import User, UserProfile, Conversation, Message
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.social.socialClasses import MessageResponse, MessageCreate
import app.social.scExceptions as exceptions

router = APIRouter(prefix="/inbox", tags=["inbox"])

@router.get("/me")
def get_inbox(current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    chats = db.query(Conversation).filter(
        or_(
            Conversation.initiator_id == current_user.id,
            Conversation.acceptor_id == current_user.id
        )
    ).all()

    return chats

@router.get("/chat/{convo_id}", response_model=list[MessageResponse])
def get_chat_history(convo_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    target_conv = db.query(Conversation).filter(Conversation.id == convo_id).first()
    exceptions.get_chat_exceptions(target_conv, current_user)

    messages = db.query(Message).filter(
        Message.conversation_id == convo_id
        ).order_by(desc(Message.time_sent)).limit(50).all()

    return reversed(messages)

@router.post("/send_msg/{convo_id}", response_model=MessageResponse)
def send_msg(convo_id: int, text: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo = db.query(Conversation).filter(Conversation.id == convo_id).first()
    exceptions.send_msg_exceptions(convo,current_user)

    new_msg = Message(conversation_id = convo_id, sender_id = current_user.id, message = text.content)

    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg