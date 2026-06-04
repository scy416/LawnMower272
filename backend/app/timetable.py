from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User, UserModule
from app.auth.dependencies import get_current_user

router = APIRouter()

class ModuleRequest(BaseModel):
    module_code: str

class AssignmentCreated(BaseModel):
    module: str
    assignment_name: str
    deadline: str 
    id: int

@router.get("/api/timetable", response_model=List[AssignmentCreated])
def get_timetable(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_modules = db.query(UserModule).filter(UserModule.user_id == current_user.id).all()
    all_assignments = []
    for um in user_modules:
        all_assignments.extend(database.get(um.module_code, []))
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
        
    fetched_assignments = database.get(mod, [])
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



database = {
    "CS1010A": [
        AssignmentCreated(id=1, module="CS1010A", assignment_name="Mission 1", deadline="W3"),
        AssignmentCreated(id=2, module="CS1010A", assignment_name="Mission 2", deadline="W4"),
        AssignmentCreated(id=3, module="CS1010A", assignment_name="Final Project", deadline="W13")
    ],
    "MA1522": [
        AssignmentCreated(id=4, module="MA1522", assignment_name="Tutorial 1", deadline="W3"),
        AssignmentCreated(id=5, module="MA1522", assignment_name="Quiz 1", deadline="W3")
    ]
}