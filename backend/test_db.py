import sqlite3

conn = sqlite3.connect('C:/Users/User/orbital/LawnMower272/backend/test.db')
cursor = conn.cursor()
cursor.execute("SELECT * FROM user_profiles")
rows = cursor.fetchall()
for row in rows:
    print(row)
conn.close()
