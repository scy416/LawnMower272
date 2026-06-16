from pydantic import BaseModel
from typing import Optional 

class ProfileUpdate(BaseModel):
    major: Optional[str] = None
    year: Optional[int] = None
    bio: Optional[str] = None

class UserProfileBase(BaseModel):
    username: str
    email: str

    class Config:
        from_attributes = True

class ProfileResponse(UserProfileBase):
    major: Optional[str]
    year: Optional[int]
    bio: Optional[str]