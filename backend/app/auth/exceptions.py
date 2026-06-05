from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

async def invalid_email_format(request: Request, exc: RequestValidationError):
    for error in exc.errors():
        if "email" in error.get("loc", []):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Please provide a valid email format."}
            )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Invalid input. Please check your fields."}
    )

