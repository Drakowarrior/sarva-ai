import asyncio
import os
import sys
import bcrypt
from uuid import uuid4
from datetime import datetime

# Append backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.mongodb import db

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

async def seed_demo_accounts():
    print("--- STARTING DEMO DATA SEEDING PROCESS ---")
    
    # 1. Configuration
    org_id = "ORG_igt_demo"
    org_name = "IGT Solutions"
    invite_code = "INV-IGT123"
    password_plain = "password123"
    hashed_pass = get_password_hash(password_plain)
    now = datetime.utcnow().isoformat() + "Z"
    
    # Clear any previous demo entries
    print("Cleaning any existing demo accounts...")
    demo_emails = [
        "karan.creator@igt.com",
        "athrav.sharma@igt.com",
        "rahul.verma@igt.com",
        "kartik.singh@igt.com",
        "nisha.gupta@igt.com",
        "sameer.sen@igt.com"
    ]
    await db.users.delete_many({"email": {"$in": demo_emails}})
    await db.organizations.delete_one({"organizationId": org_id})
    await db.organization_members.delete_many({"organizationId": org_id})
    
    # 2. Insert Organization Record
    print(f"Creating organization '{org_name}'...")
    org_doc = {
        "organizationId": org_id,
        "organizationName": org_name,
        "slug": "igt-solutions",
        "description": "Enterprise workspace for AI and software services",
        "industry": "Artificial Intelligence",
        "website": "www.igtsolutions.com",
        "logo": "/logos/default.png",
        "ownerUserId": "", # Will be set to the Head user id
        "inviteCode": invite_code,
        "departments": ["Artificial Intelligence", "Human Resources", "Software Development", "Research"],
        "status": "active",
        "createdAt": now,
        "updatedAt": now
    }
    
    # 3. Define users
    users_data = [
        {
            "name": "Karan Creator",
            "email": "karan.creator@igt.com",
            "role": "Head",
            "dept": "Artificial Intelligence"
        },
        {
            "name": "Athrav Sharma",
            "email": "athrav.sharma@igt.com",
            "role": "Team Lead",
            "dept": "Artificial Intelligence"
        },
        {
            "name": "Rahul Verma",
            "email": "rahul.verma@igt.com",
            "role": "HR",
            "dept": "Human Resources"
        },
        {
            "name": "Kartik Singh",
            "email": "kartik.singh@igt.com",
            "role": "Executive",
            "dept": "Artificial Intelligence"
        },
        {
            "name": "Nisha Gupta",
            "email": "nisha.gupta@igt.com",
            "role": "Intern",
            "dept": "Software Development"
        },
        {
            "name": "Sameer Sen",
            "email": "sameer.sen@igt.com",
            "role": "Student",
            "dept": "Research"
        }
    ]
    
    head_user_id = ""
    
    # 4. Insert users and members
    for idx, u in enumerate(users_data):
        user_id = str(uuid4())
        if u["role"] == "Head":
            head_user_id = user_id
            
        print(f"Registering user: {u['name']} ({u['role']})")
        user_doc = {
            "user_id": user_id,
            "fullName": u["name"],
            "username": u["name"].lower().replace(" ", "_"),
            "email": u["email"],
            "hashed_password": hashed_pass,
            "accountType": "organization",
            "organizationId": org_id,
            "role": u["role"],
            "department": u["dept"],
            "avatar": "/avatars/default.png",
            "createdAt": now
        }
        await db.users.insert_one(user_doc)
        
        member_doc = {
            "organizationId": org_id,
            "userId": user_id,
            "role": u["role"],
            "department": u["dept"],
            "joinedAt": now,
            "status": "active"
        }
        await db.organization_members.insert_one(member_doc)
        
    # Link creator/owner to organization
    org_doc["ownerUserId"] = head_user_id
    await db.organizations.insert_one(org_doc)
    
    print("\n" + "="*50)
    print("DEMO ORG SEEDED SUCCESSFULLY!")
    print(f"Organization: {org_name}")
    print(f"Invite Code:  {invite_code}")
    print(f"Password for all accounts: {password_plain}")
    print("="*50)
    for u in users_data:
        print(f"👤 {u['name']:<16} | Role: {u['role']:<10} | Email: {u['email']}")
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(seed_demo_accounts())
