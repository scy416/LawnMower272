from app.database.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
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
    #friends = Column(Integer) #NEEDS A RELATIONSHIP, CREATE LATER
    #courses = Column(Integer) #NEEDS A RELATIONSHIP, CREATE LATER


class UserModule(Base):
    __tablename__ = 'user_modules'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    module_code = Column(String, nullable=False, index=True)