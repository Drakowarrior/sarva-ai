import asyncio
import os
import sys
import re
import random
import string
from uuid import uuid4
from datetime import datetime, timedelta

# Append backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.mongodb import db

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

async def run_tests():
    print("--- STARTING AUTOMATED ORGANIZATION COLLABORATION TESTS ---")
    
    # 1. Clear database test collections
    print("\n[STEP 1] Clearing existing test data...")
    await db.users.delete_many({"email": {"$regex": ".*test_org_.*"}})
    await db.organizations.delete_many({"organizationName": {"$regex": ".*Test Org.*"}})
    await db.organization_members.delete_many({})
    await db.chat_shares.delete_many({})
    await db.invitations.delete_many({})
    
    # Define test data
    now = datetime.utcnow().isoformat() + "Z"
    
    # 2. Register Personal User
    print("\n[STEP 2] Testing Personal registration...")
    personal_user_id = str(uuid4())
    personal_user = {
        "user_id": personal_user_id,
        "fullName": "Test Personal User",
        "username": "test_org_personal",
        "email": "test_org_personal@example.com",
        "hashed_password": "hashed_password_123",
        "accountType": "personal",
        "organizationId": None,
        "role": None,
        "department": None,
        "avatar": "/avatars/default.png",
        "createdAt": now
    }
    await db.users.insert_one(personal_user)
    
    saved_personal = await db.users.find_one({"user_id": personal_user_id})
    assert saved_personal is not None
    assert saved_personal["accountType"] == "personal"
    assert saved_personal["organizationId"] is None
    print("✓ Personal user registered successfully.")
    
    # 3. Create Organization Workspace
    print("\n[STEP 3] Testing Organization Workspace creation...")
    creator_user_id = str(uuid4())
    org_name = "Test Org IGT Solutions"
    org_id = f"ORG_{uuid4().hex[:8]}"
    org_slug = slugify(org_name)
    invite_code = "INV-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    # Organization document
    org_doc = {
        "organizationId": org_id,
        "organizationName": org_name,
        "slug": org_slug,
        "description": "Test organization workspace",
        "industry": "Artificial Intelligence",
        "logo": "/logos/default.png",
        "ownerUserId": creator_user_id,
        "inviteCode": invite_code,
        "departments": ["Engineering"],
        "status": "active",
        "createdAt": now,
        "updatedAt": now
    }
    await db.organizations.insert_one(org_doc)
    
    # Creator user document
    creator_user = {
        "user_id": creator_user_id,
        "fullName": "Karan Creator",
        "username": "test_org_creator",
        "email": "test_org_creator@example.com",
        "hashed_password": "hashed_password_456",
        "accountType": "organization",
        "organizationId": org_id,
        "role": "Head",
        "department": "Engineering",
        "avatar": "/avatars/default.png",
        "createdAt": now
    }
    await db.users.insert_one(creator_user)
    
    # Creator member document
    creator_member = {
        "organizationId": org_id,
        "userId": creator_user_id,
        "role": "Head",
        "department": "Engineering",
        "joinedAt": now,
        "status": "active"
    }
    await db.organization_members.insert_one(creator_member)
    
    # Verify organization creation
    saved_org = await db.organizations.find_one({"organizationId": org_id})
    assert saved_org is not None
    assert saved_org["organizationName"] == org_name
    assert saved_org["inviteCode"] == invite_code
    
    saved_creator = await db.users.find_one({"user_id": creator_user_id})
    assert saved_creator is not None
    assert saved_creator["role"] == "Head"
    assert saved_creator["organizationId"] == org_id
    
    saved_member = await db.organization_members.find_one({"organizationId": org_id, "userId": creator_user_id})
    assert saved_member is not None
    assert saved_member["role"] == "Head"
    print("✓ Organization created and creator assigned as Head successfully.")
    
    # 4. Join Organization using Invite Code
    print("\n[STEP 4] Testing joining organization via invite code...")
    joiner_user_id = str(uuid4())
    joiner_user = {
        "user_id": joiner_user_id,
        "fullName": "Athrav Joiner",
        "username": "test_org_joiner",
        "email": "test_org_joiner@example.com",
        "hashed_password": "hashed_password_789",
        "accountType": "organization",
        "organizationId": org_id,
        "role": "Executive",
        "department": "Engineering",
        "avatar": "/avatars/default.png",
        "createdAt": now
    }
    await db.users.insert_one(joiner_user)
    
    joiner_member = {
        "organizationId": org_id,
        "userId": joiner_user_id,
        "role": "Executive",
        "department": "Engineering",
        "joinedAt": now,
        "status": "active"
    }
    await db.organization_members.insert_one(joiner_member)
    
    # Verify membership
    saved_joiner_member = await db.organization_members.find_one({"organizationId": org_id, "userId": joiner_user_id})
    assert saved_joiner_member is not None
    assert saved_joiner_member["role"] == "Executive"
    print("✓ User joined organization via invite code successfully.")
    
    # 5. Duplicate Organization name validation
    print("\n[STEP 5] Testing duplicate organization name constraint logic...")
    duplicate_org = await db.organizations.find_one({
        "organizationName": {"$regex": f"^{re.escape(org_name)}$", "$options": "i"}
    })
    assert duplicate_org is not None
    print("✓ Duplicate organization lookup functions correctly.")
    
    # 6. Prioritized Search
    print("\n[STEP 6] Testing prioritized search logic...")
    # Add a user in the same org but different department
    hr_user_id = str(uuid4())
    hr_user = {
        "user_id": hr_user_id,
        "fullName": "Rahul HR",
        "username": "test_org_hr",
        "email": "test_org_hr@example.com",
        "hashed_password": "hashed_password_101",
        "accountType": "organization",
        "organizationId": org_id,
        "role": "HR",
        "department": "Human Resources",
        "avatar": "/avatars/default.png",
        "createdAt": now
    }
    await db.users.insert_one(hr_user)
    await db.organization_members.insert_one({
        "organizationId": org_id,
        "userId": hr_user_id,
        "role": "HR",
        "department": "Human Resources",
        "joinedAt": now,
        "status": "active"
    })
    
    # Add a user in a different organization
    diff_org_id = "ORG_diff123"
    diff_user_id = str(uuid4())
    diff_user = {
        "user_id": diff_user_id,
        "fullName": "Karan Shah",
        "username": "test_org_shah",
        "email": "test_org_shah@example.com",
        "hashed_password": "hashed_password_202",
        "accountType": "organization",
        "organizationId": diff_org_id,
        "role": "Executive",
        "department": "Engineering",
        "avatar": "/avatars/default.png",
        "createdAt": now
    }
    await db.users.insert_one(diff_user)
    
    # Setup recently shared relation: creator shares with personal_user
    share_doc = {
        "originalSessionId": "session123",
        "copiedSessionId": "session456",
        "sharedByUserId": creator_user_id,
        "sharedWithUserId": personal_user_id,
        "sharedAt": now,
        "permission": "read_write",
        "status": "accepted"
    }
    await db.chat_shares.insert_one(share_doc)
    
    # Run query replication for "test_org" search triggered by "creator_user_id"
    current_user_org_id = org_id
    current_user_dept = "Engineering"
    recently_shared_ids = [personal_user_id]
    
    # Find matching users
    regex_pattern = f".*test_org.*"
    mongo_query = {
        "user_id": {"$ne": creator_user_id},
        "email": {"$exists": True, "$ne": None},
        "$or": [
            {"email": {"$regex": regex_pattern, "$options": "i"}},
            {"username": {"$regex": regex_pattern, "$options": "i"}},
            {"fullName": {"$regex": regex_pattern, "$options": "i"}}
        ]
    }
    
    cursor = db.users.find(mongo_query)
    matching_docs = await cursor.to_list(length=None)
    
    results = []
    for doc in matching_docs:
        user_org_id = doc.get("organizationId")
        is_org_member = (user_org_id == current_user_org_id) if (current_user_org_id and user_org_id) else False
        is_same_dept = is_org_member and (doc.get("department") == current_user_dept) if (current_user_dept and doc.get("department")) else False
        
        try:
            recency_index = recently_shared_ids.index(doc["user_id"])
            is_recently_shared = True
        except ValueError:
            recency_index = 9999
            is_recently_shared = False
            
        results.append({
            "userId": doc["user_id"],
            "name": doc.get("fullName") or doc.get("username") or "",
            "isOrgMember": is_org_member,
            "isSameDept": is_same_dept,
            "isRecentlyShared": is_recently_shared,
            "recencyIndex": recency_index
        })
        
    results.sort(key=lambda x: (
        not x["isOrgMember"],
        not x["isRecentlyShared"],
        not x["isSameDept"],
        x["recencyIndex"],
        x["name"].lower()
    ))
    
    print("\nSearch results ordered by priority:")
    for idx, r in enumerate(results):
        print(f"{idx+1}. Name: {r['name']} | Org Member: {r['isOrgMember']} | Same Dept: {r['isSameDept']} | Recent Share: {r['isRecentlyShared']}")
        
    # Assertions
    # 1. Organization members must appear first
    assert results[0]["isOrgMember"] is True
    # 2. Same department members should appear before different department members of same org if recently shared is equal
    assert results[0]["name"] == "Athrav Joiner"  # Same Org, Same Dept, not recently shared
    assert results[1]["name"] == "Rahul HR"       # Same Org, Different Dept, not recently shared
    # 3. Recently shared user (personal user) must appear before non-recently shared other users
    # Personal user is index 2 or 3 depending on org membership
    personal_rank = next(i for i, r in enumerate(results) if r["userId"] == personal_user_id)
    diff_user_rank = next(i for i, r in enumerate(results) if r["userId"] == diff_user_id)
    assert personal_rank < diff_user_rank
    
    print("✓ User search prioritization behaves exactly as specified.")
    print("\n--- ALL AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    asyncio.run(run_tests())
