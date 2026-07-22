# Script to generate random data in database
import random
from faker import Faker
from app.database.database import SessionLocal
from app.database.models import User, UserProfile, UserModule, Assignment, Module

fake = Faker()

MAJORS = ["Computer Science", "Information Systems", "Business Analytics", "Information Security", "Computer Engineering"]

MODULE_POOL = [
    # Core CS
    "CS1010S", "CS1101S", "CS1231S", "CS2030S", "CS2040S",
    "CS2100", "CS2101", "CS2103T", "CS2105", "CS2106",
    "CS2109S", "CS3230", "CS3243", "CS3244", "CS4231",
    # Algorithms & Theory
    "CS3236", "CS4232", "CS4261", "CS5230", "CS5234",
    # Systems
    "CS2102", "CS3219", "CS4218", "CS4224", "CS4225",
    # AI & Data
    "CS3264", "CS4243", "CS4248", "CS5228", "CS5340",
    # Networks & Security
    "CS2107", "CS3235", "CS4236", "CS5321", "CS5331",
    # HCI & Graphics
    "CS3240", "CS3247", "CS4240", "CS4247", "CS4350",
    # IS Modules
    "IS1108", "IS2218", "IS3103", "IS4100", "IS4151",
    # Business Analytics
    "BT1101", "BT2102", "BT3102", "BT4222", "BT4240",
    # Math & Stats
    "MA1521", "MA1522", "ST2334", "ST3131", "ST4234",
    # Breadth / CP
    "CP2106", "CP3106", "CP3209",
]

def seed_database(num_users=100):
    db = SessionLocal()

    try:
        for mod in MODULE_POOL:
            new_module = Module(code=mod)
            db.add(new_module)

        db.commit()

        for mod in MODULE_POOL:
            available_weeks = [w for w in range(2, 13) if w != 7]
            num_assignments = random.randint(3, 6)
            assignment_weeks = sorted(random.sample(available_weeks, num_assignments))

            for i, week in enumerate(assignment_weeks):
                new_assignment = Assignment(
                    module_code=mod,
                    assignment_name=f"Assignment {i + 1}",
                    deadline=f"W{week}"
                )
                db.add(new_assignment)

            # ensure mid term on w7
            db.add(Assignment(
                module_code=mod,
                assignment_name="Mid-Term",
                deadline="W7"
            ))

            # ensure finals on w13
            db.add(Assignment(
                module_code=mod,
                assignment_name="Final Examination",
                deadline="W13"
            ))

        db.commit()

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