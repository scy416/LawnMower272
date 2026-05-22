import fastapi # connect frontend to data 
import jwt #json web token
from pydantic import BaseModel # data validation and settings management using python type annotations
from typing import List # type inference for lists

web = fastapi.FastAPI() # create an instance of the FastAPI class

# cross origin resurce sharing (CORS) allows you to transfer data across different servers

web.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"], #to be replaced by the actual url later on 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# pydantics data models ensures that all data fulfills these requirements before being processed by the API

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
@web.get("/api/timetable", response_model=List[AssignmentCreated])
def get_timetable():
    return mock_timetable

# receives a new assignment from the frontend and saves it to the backend
@web.post("/api/timetable", response_model=AssignmentCreated)
def create_assignment(assignment: CreateAssignment):
    new_id = len(mock_timetable) + 1
    new_assignment = AssignmentCreated(id=new_id, **assignment.dict())
    mock_timetable.append(new_assignment)
    return new_assignment

# mock data for testing purposes
mock_timetable = [
    AssignmentCreated(id=1, module="CS1010A", assignment_name="Mission 3", deadline="2026-10-01"),
    AssignmentCreated(id=2, module="MA1522", assignment_name="Tutorial 4", deadline="2026-10-05")]