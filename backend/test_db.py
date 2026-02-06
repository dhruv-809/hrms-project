from database.db import db

test_collection = db["test"]

result = test_collection.insert_one({"name": "Dhruv", "project": "HRMS"})
print("Inserted ID:", result.inserted_id)
