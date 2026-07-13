from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.database.models import User, ModuleReview
from app.auth.dependencies import get_current_user
from app.forum.forumClasses import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/forum", tags=["forum"])


@router.get("/modules")
def get_all_reviewed_modules(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    results = (
        db.query(
            ModuleReview.module_code,
            func.count(ModuleReview.id).label("review_count"),
            func.avg(ModuleReview.rating).label("avg_rating")
        )
        .group_by(ModuleReview.module_code)
        .order_by(ModuleReview.module_code)
        .all()
    )
    out = []
    for r in results:
        out.append({
            "module_code": r.module_code,
            "review_count": r.review_count,
            "avg_rating": round(r.avg_rating, 1) if r.avg_rating else 0.0
        })
    return out


@router.get("/reviews/{module_code}", response_model=list[ReviewResponse])
def get_module_reviews(module_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reviews = (
        db.query(ModuleReview)
        .filter(ModuleReview.module_code == module_code.upper())
        .order_by(ModuleReview.created_at.desc())
        .all()
    )
    return [
        ReviewResponse(
            id=r.id,
            author_id=r.author_id,
            author_username=r.author.username,
            module_code=r.module_code,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at
        )
        for r in reviews
    ]


@router.get("/summary/{module_code}")
def get_module_summary(module_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = (
        db.query(
            func.count(ModuleReview.id).label("review_count"),
            func.avg(ModuleReview.rating).label("avg_rating")
        )
        .filter(ModuleReview.module_code == module_code.upper())
        .first()
    )
    return {
        "module_code": module_code.upper(),
        "review_count": result.review_count or 0,
        "avg_rating": round(result.avg_rating, 1) if result.avg_rating else 0.0
    }


@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(review_in: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_review = ModuleReview(
        author_id=current_user.id,
        module_code=review_in.module_code.upper(),
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return ReviewResponse(
        id=new_review.id,
        author_id=new_review.author_id,
        author_username=current_user.username,
        module_code=new_review.module_code,
        rating=new_review.rating,
        comment=new_review.comment,
        created_at=new_review.created_at
    )


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    review = db.query(ModuleReview).filter(ModuleReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
    db.delete(review)
    db.commit()
