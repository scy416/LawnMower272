from app.database.models import User
from app.userProfile.profileClasses import ProfileResponse

def build_profile_response(user: User) -> ProfileResponse:
    return ProfileResponse(
        username=user.username,
        email=user.email,
        major=user.profile.major,
        year=user.profile.year,
        bio=user.profile.bio,
        modulesTaken=user.profile.modulesTaken.split(",") if user.profile.modulesTaken else [],
        modulesToTake=user.profile.modulesToTake.split(",") if user.profile.modulesToTake else []
    )