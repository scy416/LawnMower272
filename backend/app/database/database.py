from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv() # loads variables from your .env file into the environment
DATABASE_URL = os.getenv("DATABASE_URL") # reads DATABASE_URL from .env

engine = create_engine(DATABASE_URL) # the engine is the actual link between SQLAlchemy and your database
 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # SessionLocal is a factory that creates database sessions

Base = declarative_base() # Base is the parent class all your models will inherit from

# dependency function — used by FastAPI to give each request its own session
# yields a session, then closes it automatically when the request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()