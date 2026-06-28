from pydantic import BaseModel

class FriendResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class FriendAdd(BaseModel):
    selfId: int
    friendId: int

class FriendRequestResponse(BaseModel):
    request_id: int
    sender_id: int
    sender_username: str

    class Config:
        from_attributes = True