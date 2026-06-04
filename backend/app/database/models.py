from app.database.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer,  primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, nullable=False)

class UserModule(Base):
    __tablename__ = 'user_modules'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    module_code = Column(String, nullable=False, index=True)