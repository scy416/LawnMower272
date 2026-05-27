Dear all, Our glorious team is called LawnMower272

lets js use google docs to do the readme & google sheets(?) for porject log I dont understand how this works

hello world!

To visit homepage:

cd "frontend"
npm run dev
copy localhost link to browser 

Website navigation framework: https://reactrouter.com/start/framework/routing 

Database handling
First time setting up:
bash# 1. pull the repo
git pull origin main

# 2. install python dependencies
pip install -r requirements.txt

# 3. create your .env file in the backend folder
# (copy this and fill in YOUR password)
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/syllabuddy
SECRET_KEY=any-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 4. create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE syllabuddy;"

# 5. apply all migrations to create the tables
alembic upgrade head

Ongoing — when you pull new changes:
bash# after git pull, always run this in case there are new migrations
alembic upgrade head

When YOU change a model:
bash# 1. make your changes in models.py

# 2. generate a new migration
alembic revision --autogenerate -m "describe what changed"

# 3. apply it
alembic upgrade head

# 4. push the new migration file to GitHub
git add .
git commit -m "add migration: describe what changed"
git push

Useful Alembic commands:
bashalembic upgrade head        # apply all pending migrations
alembic downgrade -1        # undo the last migration
alembic current             # show which migration your DB is on
alembic history             # list all migrations

to test backend code: uvicorn app.test:app --reload 