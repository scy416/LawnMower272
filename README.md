Dear all, Our glorious team is called LawnMower272

lets js use google docs to do the readme & google sheets(?) for porject log I dont understand how this works

hello world!

Website navigation framework: https://reactrouter.com/start/framework/routing 

Database handling
First time setting up:
bash# 1. pull the repo
git pull origin main
# Guide
## Testing
### 1. Run the backend
cd "backend"
uvicorn app.main:app --reload 
add a /docs behind the local host link to test directly

### 2. Run the front end
open a **new** terminal (make sure other terminal is still running the backend)
cd "frontend"
npm run dev

### 3. Attempt to log in
email: 123@gmail.com
password: 123

### 4. Navigate homescreen
you should be in the timetable screen
## Relevant installations
### 1. install python dependencies
cd "backend"
pip install -r requirements.txt

### 2. create your .env file in the backend folder
### (copy this and fill in YOUR password)
DATABASE_URL=postgresql://postgres:**yourpassword**@localhost:5432/syllabuddy
SECRET_KEY= (your own secret key)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

### 3. create your database in PostgreSQL
psql -U postgres -c "CREATE DATABASE syllabuddy;"

### 4. apply all migrations to create the tables
alembic upgrade head
- use this command to update ur database with most updated data

## Alembic guide

### 1. apply all migrations to create the tables
alembic upgrade head
- use this command to update ur database with most updated data

### 2. When you make changes in data
alembic revision --autogenerate -m "describe what changed"

### 3. apply it
alembic upgrade head

### 4. push the new migration file to GitHub
git add .
git commit -m "add migration: describe what changed"
git push

Useful Alembic commands:
bashalembic upgrade head        # apply all pending migrations
alembic downgrade -1        # undo the last migration
alembic current             # show which migration your DB is on
alembic history             # list all migrations

## misc info
Test users

testuser1, testuser1@gmail.com, 123 (id:1)

Michael, Michael@gmail.com 123 (id:2)

john, john@example.com 123 (id:3)