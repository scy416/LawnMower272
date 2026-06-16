from fastapi import HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database.models import User, UserProfile, Conversation

def get_convo_exceptions(target_user_id: int, current_user: User):
    if current_user.id == target_user_id:
        raise HTTPException(status_code=400, detail="Cannot message yourself")

def accept_convo_exceptions(convo: Conversation, current_user: User):
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if not convo.acceptor_id == current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to accept")
    
    if convo.status == "accepted":
        raise HTTPException(status_code=400, detail="Already accepted request")

def reject_convo_exceptions(convo: Conversation, current_user: User):
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if not convo.acceptor_id == current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to reject")
    
    if convo.status != "pending":
        raise HTTPException(status_code=400, detail="Request error")

def get_chat_exceptions(convo: Conversation, current_user: User):
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    if current_user.id not in [convo.initiator_id, convo.acceptor_id]:
        raise HTTPException(status_code=403, detail="Not authorized to view this chat")
    
def send_msg_exceptions(convo: Conversation, current_user: User):
    if not convo or current_user.id not in [convo.initiator_id, convo.acceptor_id]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if convo.status != "accepted" and current_user.id != convo.initiator_id:
        raise HTTPException(status_code=400, detail="Accept chat request first.")