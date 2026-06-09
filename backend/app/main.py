from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.auth.authMain import router as auth_router
from app.timetable import router as timetable_router
from app.userProfile.profileMain import router as profile_router
from app.auth.exceptions import invalid_email_format

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, invalid_email_format)

#routers here :D
app.include_router(auth_router)
app.include_router(timetable_router)
app.include_router(profile_router)