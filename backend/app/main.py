from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.database.database import engine, Base
from app.database import models

from app.auth.aExceptions import invalid_email_format

from app.auth.authMain import router as auth_router
from app.timetable import router as timetable_router
from app.userProfile.profileMain import router as profile_router
from app.userProfile.friends.friendsMain import router as friends_router
from app.userProfile.friends.requesthandler import router as friend_request_router
from app.social.socialMain import router as social_router
from app.social.inbox import router as inbox_router
from app.chatbot.chatbotMain import router as chatbot_router
from app.forum.forumMain import router as forum_router


#Base.metadata.create_all(bind=engine) //this allows fastapi to create tables, we let alembic do the work instead

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, invalid_email_format)


app.include_router(auth_router)
app.include_router(timetable_router)
app.include_router(profile_router)
app.include_router(friends_router)
app.include_router(friend_request_router)
app.include_router(social_router)
app.include_router(inbox_router)
app.include_router(chatbot_router)
app.include_router(forum_router)