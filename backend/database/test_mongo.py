import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

uri = os.getenv("MONGO_URI")

try:
    client = MongoClient(uri)

    client.admin.command("ping")

    print("MongoDB Connected Successfully ✅")

except Exception as e:
    print("MongoDB Connection Failed ❌")
    print(e)