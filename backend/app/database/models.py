from app.database.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY 
from datetime import datetime

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer,  primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, nullable=False)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    modules = relationship("UserModule", back_populates="user")

friends_table = Table(
    'friends',
    Base.metadata,
    Column('profile_id', Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), primary_key=True),
    Column('friend_profile_id',Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), primary_key=True)
)

class UserProfile(Base):
    __tablename__ = 'user_profiles'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)

    major = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    bio = Column(String, nullable=True)
    modulesTaken = Column(ARRAY(String), nullable=True, default=list)
    modulesToTake = Column(ARRAY(String), nullable=True, default=list)
    
    user = relationship("User", back_populates = "profile")
    
    friends = relationship('UserProfile', secondary='friends', 
        primaryjoin = (user_id == friends_table.c.profile_id),
        secondaryjoin = (user_id == friends_table.c.friend_profile_id)
    )


class UserModule(Base):
    __tablename__ = 'user_modules'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    module_code = Column(String, nullable=False, index=True)

    user = relationship("User", back_populates="modules")

class FriendRequest(Base):
    __tablename__ = 'friend_requests'

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), nullable=False, index=True)
    status = Column(String, default = "pending", nullable=False)

class Conversation(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, index=True)
    initiator_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), nullable=False, index=True)
    acceptor_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), nullable=False, index=True)
    status = Column(String, default="pending", nullable=False)


class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id',ondelete='CASCADE'), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), nullable=False, index=True)
    message = Column(String, nullable=False)
    time_sent = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False, nullable=False)


class ModuleReview(Base):
    __tablename__ = 'module_reviews'

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    module_code = Column(String, nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    author = relationship("User")


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DiscoverCache(Base):
    __tablename__ = 'discover_cache'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    recommended_ids = Column(ARRAY(Integer), nullable=False, default=list)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
