from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

import jwt
from jwt.exceptions import InvalidTokenError

from app.database.database import get_db
from app.database.models import User
from app.auth.schemas import TokenData
from app.config import settings

# tells FastAPI where the login endpoint is so it can extract the Bearer token
# the token is read from the Authorization: Bearer <token> header automatically
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),  # extracts JWT from Authorization header
    db: Session = Depends(get_db)         # provides DB session
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # decode the JWT using the same secret key and algorithm used to sign it
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")  # "sub" holds the user id (set in security.py)
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=int(user_id))
    except InvalidTokenError:
        # catches expired tokens, invalid signature, malformed tokens, etc.
        raise credentials_exception

    # look up the user in the DB using the id from the token
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception

    return user  # returned user is now available in any protected route via Depends()

#use current_user: User = Depends(get_current_user) in the future for all features that requires user login