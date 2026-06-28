from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str 
    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  
    ALGORITHM: str = "HS256"
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()