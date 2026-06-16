from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ConversationResponse(BaseModel):
    conversation_id: int
    initiator_id: int    
    acceptor_id: int
    status: str

    model_config = ConfigDict(from_attributes=True)

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    message: str
    time_sent: datetime

    model_config = ConfigDict(from_attributes=True)

class MessageCreate(BaseModel):
    content: str