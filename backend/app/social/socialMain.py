import random
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.database.models import User, UserProfile, Conversation, DiscoverCache
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.social.socialClasses import ConversationResponse

from app.userProfile.friends.friendsMain import is_friend
import app.social.scExceptions as exceptions
from app.social.recoAlgo import compute_daily_recommendations

router = APIRouter(prefix="/social", tags=['social'])

@router.post("/chat/{target_user_id}", response_model=ConversationResponse)
def make_or_get_conversation(target_user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exceptions.get_convo_exceptions(target_user_id, current_user)

    existing_conv = db.query(Conversation).filter(
        or_(
            and_(Conversation.initiator_id == current_user.id, Conversation.acceptor_id == target_user_id),
            and_(Conversation.initiator_id == target_user_id, Conversation.acceptor_id == current_user.id)
        )
    ).first()

    if existing_conv:
        return {
            "conversation_id": existing_conv.id, 
            "status": existing_conv.status,
            "initiator_id": existing_conv.initiator_id,
            "acceptor_id": existing_conv.acceptor_id
        }

    new_conversation = Conversation(
        initiator_id=current_user.id, 
        acceptor_id=target_user_id, 
        status="accepted"
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return {
        "conversation_id": new_conversation.id, 
        "status": new_conversation.status,
        "initiator_id": new_conversation.initiator_id,
        "acceptor_id": new_conversation.acceptor_id
    }

def get_all_other_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    friend_ids = {current_user.id}
    if current_user.profile:
        friend_profiles = current_user.profile.friends
        for fp in friend_profiles:
            friend_ids.add(fp.user_id)

    other_profiles = db.query(UserProfile).filter(
        UserProfile.user_id.notin_(friend_ids)
    ).all()

    sample = random.sample(other_profiles, min(10, len(other_profiles)))

    results = []
    for profile in sample:
        results.append({
            "id": profile.user_id,
            "name": profile.user.username,
            "year": profile.year or 3,
            "major": profile.major or "Undeclared",
            "bio": profile.bio or "No bio provided.",
            "modules": profile.modulesTaken or [],
        })

    return results

@router.get("/discover")
def get_top_matches(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cache = db.query(DiscoverCache).filter(
        DiscoverCache.user_id == current_user.id
    ).first()

    if not cache or not cache.recommended_ids:
        return get_all_other_users(current_user = current_user, db = db)


    match_profiles = db.query(UserProfile).filter(
        UserProfile.user_id.in_(cache.recommended_ids)
    ).all()

    results = []
    profile_dict = {p.user_id: p for p in match_profiles}
    
    for match_id in cache.recommended_ids:
        if match_id in profile_dict:
            p = profile_dict[match_id]
            results.append({
                "id": p.user_id,
                "name": p.user.username,
                "year": p.year or 3,
                "major": p.major or "Undeclared",
                "bio": p.bio or "No bio provided.",
                "modules": p.modulesTaken or [],
            })

    return results

@router.post("/admin/force-recalculate") #For testing of recoAlgo.py in swagger
def force_recalculate(current_user: User = Depends(get_current_user)):
    compute_daily_recommendations()
    return {"message": "Recommendation Engine triggered successfully."}

@router.get("/api/search/profiles")
def search_full_profiles(q: str, db: Session = Depends(get_db)):
    if not q:
        return []

    matches = db.query(User).filter(User.username.ilike(f"%{q}%")).limit(20).all()
    
    results = []
    for user in matches:
        if user.profile:
            p = user.profile
            results.append({
                "id": p.user_id,
                "name": p.user.username,
                "year": p.year or 3,
                "major": p.major or "Undeclared",
                "bio": p.bio or "No bio provided.",
                "modules": p.modulesTaken or [],
            })
            
    return results