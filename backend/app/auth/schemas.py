from pydantic import BaseModel, EmailStr

# --- Request schemas (what the client sends) ---

class UserCreate(BaseModel):
    username: str
    email: EmailStr       # validates it's a proper email format
    password: str         # plain text — will be hashed before storing

class UserLogin(BaseModel):
    email: EmailStr
    password: str         # plain text — will be verified against stored hash

# --- Response schemas (what the server returns) ---

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    # hashed_password is intentionally excluded — never expose it

    class Config:
        from_attributes = True  # allows Pydantic to read SQLAlchemy model fields

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"  # standard JWT response format

class TokenData(BaseModel):
    user_id: int | None = None  # decoded from the JWT payload (the "sub" field)