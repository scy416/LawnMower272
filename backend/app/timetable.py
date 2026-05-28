from fastapi import APIRouter
from pydantic import BaseModel # data validation and settings management using python type annotations
from typing import List # type inference for lists

router = APIRouter()

class ModuleRequest(BaseModel):
    module_code: str

class AssignmentCreated(BaseModel):
    module: str
    assignment_name: str
    deadline: str 
    id: int

# sends the list of all existing assignments to the frontend
# response_model - ensures that all the responses is in the correct format of AssignmentCreated
# List[] - you must typehint as a requirement of FastAPI
@router.get("/api/timetable", response_model=List[AssignmentCreated])
def get_timetable():
    return []

# receives a new assignment from the frontend and saves it to the backend
@router.post("/api/modules", response_model=List[AssignmentCreated])
def fetch_module(assignment: ModuleRequest):
    mod = assignment.module_code.upper()
    fetched_assignments = database.get(mod, [])
    return fetched_assignments

# mock data for testing purposes
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