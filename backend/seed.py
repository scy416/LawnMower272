import random
from faker import Faker
from app.database.database import SessionLocal
from app.database.models import User, UserProfile, UserModule, Assignment

fake = Faker()

MAJORS = ["Computer Science", "Information Systems", "Business Analytics", "Information Security", "Computer Engineering"]

MODULE_POOL = [
    "CS1010S", "CS1101S", "CS1231S", "CS2030S", "CS2040S",
    "CS2100", "CS2101", "CS2103T", "CS2105", "CS2106", 
    "CS2109S", "CS3230", "CS3243", "CS3244", "CS4231", 
    "IS1108", "IS2218", "IS3103", "BT1101", "BT2102", 
    "CP2106", "MA1521", "ST2334"
]

ASSIGNMENT_BASES = ["Tutorial", "Lab", "Mission", "Quiz", "Problem Set"]
ONE_OFF_ASSIGNMENTS = ["Midterm Assessment", "Final Project Proposal", "Final Project", "Peer Review"]

#Print statements for my own debugging
def seed_database(num_users=100):
    db = SessionLocal()
    
    try:
        #print("Seeding Global Assignments for all modules...")

        for mod in MODULE_POOL:
            num_assignments = random.randint(3, 7) 
            deadlines = random.sample(range(2, 14), num_assignments)
            deadlines.sort()
            
            for i, week in enumerate(deadlines):
                if i == num_assignments - 1:
                    name = random.choice(ONE_OFF_ASSIGNMENTS)
                else:
                    base = random.choice(ASSIGNMENT_BASES)
                    name = f"{base} {i+1}"
                    
                new_assignment = Assignment(
                    module_code=mod,
                    assignment_name=name,
                    deadline=f"W{week}"
                )
                db.add(new_assignment)
        
        db.commit()
        #print("Global Assignments successfully seeded!")

        #print(f"Generating {num_users} fake users...")
        for _ in range(num_users):
            new_user = User(
                username=fake.unique.user_name(),
                email=fake.unique.email(),
                hashed_password="fakehashedpassword123" 
            )
            db.add(new_user)
            db.commit() 
            db.refresh(new_user)

            taken_count = random.randint(2, 6)
            totake_count = random.randint(1, 4)
            sampled_modules = random.sample(MODULE_POOL, taken_count + totake_count)
            modules_taken = sampled_modules[:taken_count]
            modules_to_take = sampled_modules[taken_count:]

            new_profile = UserProfile(
                user_id=new_user.id,
                major=random.choice(MAJORS),
                year=random.randint(1, 4),
                bio=fake.sentence(),
                modulesTaken=modules_taken, 
                modulesToTake=modules_to_take
            )
            db.add(new_profile)

            for mod in sampled_modules:
                new_user_module = UserModule(
                    user_id=new_user.id,
                    module_code=mod
                )
                db.add(new_user_module)

        db.commit()
        print("Database successfully seeded with users!")

    except Exception as e:
        db.rollback()
        print(f"Failed to seed database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(100)