from fastapi import APIRouter
from pydantic import BaseModel # data validation and settings management using python type annotations
from typing import List # type inference for lists

router = APIRouter()

class CreateAssignment(BaseModel):
    module: str
    assignment_name: str
    deadline: str 

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
    return mock_timetable

# receives a new assignment from the frontend and saves it to the backend
@router.post("/api/timetable", response_model=AssignmentCreated)
def create_assignment(assignment: CreateAssignment):
    new_id = len(mock_timetable) + 1
    new_assignment = AssignmentCreated(id=new_id, **assignment.dict())
    mock_timetable.append(new_assignment)
    return new_assignment

# mock data for testing purposes
mock_timetable = [
    AssignmentCreated(id=1, module="CS1010A", assignment_name="Mission 3", deadline="2026-10-01"),
    AssignmentCreated(id=2, module="MA1522", assignment_name="Tutorial 4", deadline="2026-10-05")]