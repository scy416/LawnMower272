from app.database.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer,  primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, nullable=False)

    profile = relationship("UserProfile", back_populates="user", uselist=False)

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
    
    user = relationship("User", back_populates = "profile")
    
    friends = relationship('UserProfile', secondary='friends', 
        primaryjoin = (user_id == friends_table.c.profile_id),
        secondaryjoin = (user_id == friends_table.c.friend_profile_id)
    )
    #courses = Column(Integer) #NEEDS A RELATIONSHIP, CREATE LATER

class UserModule(Base):
    __tablename__ = 'user_modules'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    module_code = Column(String, nullable=False, index=True)

class FriendRequest(Base):
    __tablename__ = 'friend_requests'

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete='CASCADE'), nullable=False, index=True)
    status = Column(String, default = "pending", nullable=False)

class Conversation(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, index=True)
    initiator_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete=CASCADE), nullable=False, index=True)
    acceptor_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete=CASCADE), nullable=False, index=True)
    status = Column(String, default="pending", nullable=False)

#Work on scalability features for messages table in future
class Messages(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id',ondelete=CASCADE), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey('user_profiles.user_id', ondelete=CASCADE), nullable=False, index=True)
    message = Column(String, nullable=False)
    time_sent = Column(Integer, nullable=False)