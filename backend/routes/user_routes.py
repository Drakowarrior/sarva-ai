import re
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from database.mongodb import db
from middleware.auth import get_user_id

router = APIRouter(
    prefix="/api",
    tags=["User"]
)

class UserSearchQuery(BaseModel):
    query: str

@router.post("/users/search")
async def search_users(
    payload: UserSearchQuery,
    user_id: str = Depends(get_user_id)
):
    try:
        search_str = payload.query.strip()
        if not search_str:
            return []
        
        # Regex search pattern - case insensitive, escaped search string
        regex_pattern = f".*{re.escape(search_str)}.*"
        
        # 1. Fetch current user metadata
        current_user = await db.users.find_one({"user_id": user_id})
        current_user_org_id = current_user.get("organizationId") if current_user else None
        current_user_dept = current_user.get("department") if current_user else None
        
        # 2. Fetch recently shared user IDs (limit to last 50 shares)
        recently_shared_ids = []
        recently_shared_cursor = db.chat_shares.find(
            {"sharedByUserId": user_id}
        ).sort("sharedAt", -1).limit(50)
        async for share in recently_shared_cursor:
            recipient_id = share.get("sharedWithUserId")
            if recipient_id and recipient_id not in recently_shared_ids:
                recently_shared_ids.append(recipient_id)
        
        # 3. Find matching users
        mongo_query = {
            "user_id": {"$ne": user_id},
            "email": {"$exists": True, "$ne": None},
            "$or": [
                {"email": {"$regex": regex_pattern, "$options": "i"}},
                {"username": {"$regex": regex_pattern, "$options": "i"}},
                {"fullName": {"$regex": regex_pattern, "$options": "i"}}
            ]
        }
        
        cursor = db.users.find(mongo_query).limit(50) # Fetch more for in-memory priority sorting
        matching_docs = await cursor.to_list(length=None)
        
        # 4. Fetch all matching organizations in one batch to resolve names
        org_ids = list(set([doc["organizationId"] for doc in matching_docs if doc.get("organizationId")]))
        org_map = {}
        if org_ids:
            org_cursor = db.organizations.find({"organizationId": {"$in": org_ids}})
            async for org in org_cursor:
                org_map[org["organizationId"]] = org["organizationName"]
        
        # 5. Populate connection metrics and details
        results = []
        for doc in matching_docs:
            user_org_id = doc.get("organizationId")
            org_name = org_map.get(user_org_id) if user_org_id else None
            
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
                "email": doc.get("email") or "",
                "avatar": doc.get("avatar") or "/avatars/default.png",
                "accountType": doc.get("accountType", "personal"),
                "organizationId": user_org_id,
                "organizationName": org_name,
                "role": doc.get("role"),
                "department": doc.get("department"),
                "isOrgMember": is_org_member,
                "isSameDept": is_same_dept,
                "isRecentlyShared": is_recently_shared,
                "recencyIndex": recency_index
            })
            
        # 6. Sort by priority order:
        #   - Organization members first
        #   - Recently shared users second
        #   - Same department third
        #   - Fallback alphabetical
        results.sort(key=lambda x: (
            not x["isOrgMember"],
            not x["isRecentlyShared"],
            not x["isSameDept"],
            x["recencyIndex"],
            x["name"].lower()
        ))
        
        # Return top 15 results
        return results[:15]
    except Exception as e:
        print(f"User Search Error: {e}")
        return []


@router.get("/user/stats")
async def get_user_statistics(user_id: str = Depends(get_user_id)):
    try:
        session_count = await db.sessions.count_documents({"user_id": user_id})
        message_count = await db.messages.count_documents({"user_id": user_id})
        pinned_count = await db.sessions.count_documents({"user_id": user_id, "pinned": True})
        favorite_count = await db.sessions.count_documents({"user_id": user_id, "favorite": True})
        
        return {
            "success": True,
            "total_sessions": session_count,
            "total_messages": message_count,
            "pinned_sessions": pinned_count,
            "favorite_sessions": favorite_count
        }
    except Exception as e:
        print(f"Stats Error: {e}")
        return {
            "success": False,
            "error": str(e),
            "total_sessions": 0,
            "total_messages": 0,
            "pinned_sessions": 0,
            "favorite_sessions": 0
        }

from datetime import datetime
from uuid import uuid4

class UserProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    phoneNumber: Optional[str] = None
    designation: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    avatar: Optional[str] = None

@router.put("/user/profile")
async def update_user_profile(
    payload: UserProfileUpdate,
    user_id: str = Depends(get_user_id)
):
    try:
        user_doc = await db.users.find_one({"user_id": user_id})
        if not user_doc:
            return {"success": False, "message": "User not found"}
        
        updates = {}
        if payload.fullName is not None:
            updates["fullName"] = payload.fullName.strip()
        if payload.phoneNumber is not None:
            updates["phoneNumber"] = payload.phoneNumber.strip()
        if payload.designation is not None:
            updates["designation"] = payload.designation.strip()
        if payload.bio is not None:
            updates["bio"] = payload.bio.strip()
        if payload.location is not None:
            updates["location"] = payload.location.strip()
        if payload.timezone is not None:
            updates["timezone"] = payload.timezone.strip()
        if payload.avatar is not None:
            updates["avatar"] = payload.avatar

        if not updates:
            return {"success": True, "message": "No changes to update"}

        await db.users.update_one({"user_id": user_id}, {"$set": updates})

        # Keep organization_members name/avatar in sync
        org_id = user_doc.get("organizationId")
        if org_id:
            member_updates = {}
            if payload.fullName is not None:
                member_updates["name"] = payload.fullName.strip()
            if payload.avatar is not None:
                member_updates["avatar"] = payload.avatar
            if member_updates:
                await db.organization_members.update_one(
                    {"organizationId": org_id, "userId": user_id},
                    {"$set": member_updates}
                )

        # Log Activity
        now = datetime.utcnow().isoformat() + "Z"
        log_id = f"LOG_{uuid4().hex[:8]}"
        await db.activity_logs.insert_one({
            "logId": log_id,
            "action": "profile_update",
            "actorId": user_id,
            "targetUserId": user_id,
            "organizationId": org_id,
            "details": "User updated profile information.",
            "timestamp": now,
            "ipAddress": "unknown",
            "device": "unknown"
        })

        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        print(f"Profile Update Error: {e}")
        return {"success": False, "error": str(e)}
    
