from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta

from app.database.database import get_db
from app.database.models import User, UserModule, Notification
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


def get_current_semester_week() -> int:
    today = date.today()
    year = today.year
    sem1_start = date(year, 8, 10)
    sem2_start = date(year, 1, 11)

    if today >= sem1_start:
        week = ((today - sem1_start).days // 7) + 1
    elif today >= sem2_start:
        week = ((today - sem2_start).days // 7) + 1
    else:
        # jan 1-10, still in previous sem1
        week = ((today - date(year - 1, 8, 10)).days // 7) + 1

    return week if 1 <= week <= 13 else 0


@router.get("/me")
def get_my_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [
        {
            "id": n.id,
            "title": n.title,
            "body": n.body,
            "is_read": n.is_read,
            "created_at": n.created_at
        }
        for n in notifications
    ]


@router.get("/unread_count")
def get_unread_count(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    return {"count": count}


@router.post("/mark_read")
def mark_all_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"status": "ok"}


@router.post("/generate_weekly")
def generate_weekly_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_week = get_current_semester_week()
    next_week_label = f"W{current_week + 1}"

    week_ago = datetime.utcnow() - timedelta(days=7)
    already_generated = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.created_at >= week_ago,
        Notification.title.like("📅 Upcoming%") | Notification.title.like("📅 Weekly%")
    ).first()

    if already_generated:
        return {"status": "already_generated", "new_count": 0}

    from app.timetable import database as timetable_db

    user_modules = db.query(UserModule).filter(UserModule.user_id == current_user.id).all()
    new_count = 0

    for um in user_modules:
        assignments = timetable_db.get(um.module_code, [])
        for assignment in assignments:
            if assignment.deadline == next_week_label:
                notif = Notification(
                    user_id=current_user.id,
                    title=f"📅 Upcoming: {um.module_code}",
                    body=f"{assignment.assignment_name} is due next week ({next_week_label})."
                )
                db.add(notif)
                new_count += 1

    if new_count == 0 and user_modules:
        notif = Notification(
            user_id=current_user.id,
            title="📅 Weekly Check",
            body=f"No assignments due next week ({next_week_label}). You're clear!"
        )
        db.add(notif)
        new_count = 1

    db.commit()
    return {"status": "generated", "new_count": new_count}
