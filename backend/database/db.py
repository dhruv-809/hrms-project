from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["hrms_db"]

try:
    client.admin.command("ping")
    print("MongoDB Connected Successfully (LOCAL)!")
except Exception as e:
    print("MongoDB Connection Failed:", e)
