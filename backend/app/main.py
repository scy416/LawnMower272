from app.auth.authMain import router as auth_router
from app.timetable import router as timetable_router
from fastapi import FastAPI

from fastapi.exceptions import RequestValidationError
from app.auth.exceptions import invalid_email_format

#routing stuff go heeere :)
app = FastAPI()
app.include_router(auth_router)
app.include_router(timetable_router)

#Cors stuff go here :)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#excetpions stuff go here :D
app.add_exception_handler(RequestValidationError, invalid_email_format)