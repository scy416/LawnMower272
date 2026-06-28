import sqlite3

try:
    conn = sqlite3.connect('C:/Users/User/orbital/LawnMower272/backend/test.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE user_profiles ADD COLUMN modulesTaken TEXT")
    cursor.execute("ALTER TABLE user_profiles ADD COLUMN modulesToTake TEXT")
    conn.commit()
    print("Migration successful")
except Exception as e:
    print("Migration failed:", e)
finally:
    conn.close()
