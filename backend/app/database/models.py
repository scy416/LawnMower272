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


class UserProfile(Base):
    __tablename__ = 'user_profiles'

    id = Column(Integer,  primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique = True, nullable=False)

    major = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    bio = Column(String, nullable=True)
    
    user = relationship("User", back_populates = "profile")
    
    friends = relationship('UserProfile', secondary='friends', 
        primaryjoin = "UserProfile.id == friends_table.c.profile_id",
        secondaryjoin = "UserProfile.id == friends_table.c.friend_profile_id"
        )
    #courses = Column(Integer) #NEEDS A RELATIONSHIP, CREATE LATER

friends_table = Table(
    'friends',
    Base.metadata,
    Column('profile_id', Integer, ForeignKey(UserProfile.id, ondelete='CASCADE'), primary_key=True),
    Column('friend_profile_id',Integer, ForeignKey(UserProfile.id, ondelete='CASCADE'), primary_key=True)
)

class UserModule(Base):
    __tablename__ = 'user_modules'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    module_code = Column(String, nullable=False, index=True)