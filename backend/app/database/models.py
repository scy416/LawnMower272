from database import Base
from sqlalchemy import Column, Integer, String

class User(Base): #creating a class of users that inherits from parent class "Base"
    __tablename__ = 'users'

    id = Column(Integer,  primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, nullable=False)