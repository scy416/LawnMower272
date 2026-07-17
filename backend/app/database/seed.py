import random
from faker import Faker
from app.database.database import SessionLocal
from app.database.models import User, UserProfile, UserModule

fake = Faker()

MAJORS = ["Computer Science", "Information Systems", "Business Analytics", "Economics", "Psychology"]
MODULE_POOL = [
    "CS1010", "CS2030", "CS2040", "MA1521", "IS3103", 
    "MKT1003", "EC1301", "ST2334", "GEC1000", "ACC1701"
]

def seed_database(num_users=100):
    db = SessionLocal()
    
    try:
        print(f"Generating {num_users} fake users...")
        
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
        print("Database successfully seeded!")

    except Exception as e:
        db.rollback()
        print(f"Failed to seed database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(100)