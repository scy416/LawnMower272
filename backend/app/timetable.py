from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User, UserModule, Assignment
from app.auth.dependencies import get_current_user

router = APIRouter()

class ModuleRequest(BaseModel):
    module_code: str

class AssignmentCreated(BaseModel):
    id: int
    module_code: str 
    assignment_name: str
    deadline: str 

    class Config:
        from_attributes = True

@router.get("/api/timetable", response_model=List[AssignmentCreated])
def get_timetable(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_modules = db.query(UserModule).filter(UserModule.user_id == current_user.id).all()
    module_codes = [um[0] for um in user_modules]
    if not module_codes:
        return []
    all_assignments = db.query(Assignment).filter(Assignment.module_code.in_(module_codes)).all()
    return all_assignments

@router.post("/api/modules", response_model=List[AssignmentCreated])
def fetch_module(
    assignment: ModuleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mod = assignment.module_code.upper()
    existing = db.query(UserModule).filter(
        UserModule.user_id == current_user.id,
        UserModule.module_code == mod
    ).first()
    
    if not existing:
        new_module = UserModule(user_id=current_user.id, module_code=mod)
        db.add(new_module)
        db.commit()
        
    fetched_assignments = db.query(Assignment).filter(Assignment.module_code == mod).all()
    return fetched_assignments

@router.delete("/api/modules/{module_code}")
def remove_module(
    module_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mod = module_code.upper()
    db.query(UserModule).filter(
        UserModule.user_id == current_user.id,
        UserModule.module_code == mod
    ).delete()
    db.commit()
    return {"status": "success", "message": f"Module {mod} removed"}