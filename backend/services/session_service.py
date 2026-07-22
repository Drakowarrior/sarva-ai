from database.mongodb import db
from uuid import uuid4
from datetime import datetime

async def create_session(user_id: str, title: str = "New Chat", session_id: str = None):
    if not session_id:
        session_id = str(uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    session = {
        "user_id": user_id,
        "session_id": session_id,
        "title": title,
        "pinned": False,
        "favorite": False,
        "last_message": "",
        "created_at": now,
        "updated_at": now
    }
    await db.sessions.insert_one(session)
    
    # Register/upsert user record
    await db.users.update_one(
        {"user_id": user_id},
        {
            "$setOnInsert": {
                "user_id": user_id,
                "username": f"User_{user_id[-8:]}" if len(user_id) > 8 else f"User_{user_id}",
                "created_at": now
            }
        },
        upsert=True
    )
    
    return {
        "success": True,
        "session_id": session_id,
        "title": title,
        "pinned": False,
        "favorite": False,
        "last_message": "",
        "created_at": now,
        "updated_at": now
    }

async def get_sessions(user_id: str):
    sessions = []
    # Sort pinned descending, then updated_at descending
    cursor = db.sessions.find({"user_id": user_id}).sort([
        ("pinned", -1),
        ("updated_at", -1)
    ])
    async for session in cursor:
        session["_id"] = str(session["_id"])
        # Ensure default values exist
        if "pinned" not in session:
            session["pinned"] = False
        if "favorite" not in session:
            session["favorite"] = False
        if "last_message" not in session:
            session["last_message"] = ""
        sessions.append(session)
    return sessions

async def delete_session(user_id: str, session_id: str):
    session_result = await db.sessions.delete_one(
        {"session_id": session_id}
    )
    await db.messages.delete_many(
        {"session_id": session_id}
    )
    return {
        "success": True,
        "deleted_count": session_result.deleted_count
    }

async def rename_session(user_id: str, session_id: str, title: str):
    now = datetime.utcnow().isoformat() + "Z"
    result = await db.sessions.update_one(
        {"session_id": session_id},
        {"$set": {"title": title, "updated_at": now}}
    )
    return {
        "success": True,
        "modified_count": result.modified_count
    }

async def toggle_pin_session(user_id: str, session_id: str, pinned: bool):
    now = datetime.utcnow().isoformat() + "Z"
    result = await db.sessions.update_one(
        {"session_id": session_id},
        {"$set": {"pinned": pinned, "updated_at": now}}
    )
    return {
        "success": True,
        "pinned": pinned,
        "modified_count": result.modified_count
    }

async def toggle_favorite_session(user_id: str, session_id: str, favorite: bool):
    now = datetime.utcnow().isoformat() + "Z"
    result = await db.sessions.update_one(
        {"session_id": session_id},
        {"$set": {"favorite": favorite, "updated_at": now}}
    )
    return {
        "success": True,
        "favorite": favorite,
        "modified_count": result.modified_count
    }

async def delete_all_sessions(user_id: str):
    sessions_result = await db.sessions.delete_many({"user_id": user_id})
    messages_result = await db.messages.delete_many({"user_id": user_id})
    return {
        "success": True,
        "sessions_deleted": sessions_result.deleted_count,
        "messages_deleted": messages_result.deleted_count
    }

async def duplicate_session(user_id: str, session_id: str):
    session = await db.sessions.find_one({"user_id": user_id, "session_id": session_id})
    if not session:
        return {"success": False, "error": "Session not found"}
        
    new_session_id = f"dup_{uuid4().hex[:8]}_{int(datetime.utcnow().timestamp() * 1000)}"
    now = datetime.utcnow().isoformat() + "Z"
    
    new_session = {
        "user_id": user_id,
        "ownerUserId": user_id,
        "session_id": new_session_id,
        "title": f"{session.get('title', 'Chat')} (Copy)",
        "pinned": False,
        "favorite": False,
        "last_message": session.get("last_message", ""),
        "created_at": now,
        "updated_at": now
    }
    await db.sessions.insert_one(new_session)
    
    original_messages = await db.messages.find(
        {"session_id": session_id}
    ).sort("timestamp", 1).to_list(length=None)
    
    new_messages = []
    for index, msg in enumerate(original_messages):
        content_val = msg.get("message") or msg.get("content") or ""
        new_messages.append({
            "user_id": user_id,
            "session_id": new_session_id,
            "role": msg.get("role"),
            "message": content_val,
            "content": content_val,
            "files": msg.get("files") or [],
            "timestamp": msg.get("timestamp") or now,
            "messageIndex": index
        })
        
    if new_messages:
        await db.messages.insert_many(new_messages)
        
    return {
        "success": True,
        "session_id": new_session_id,
        "title": new_session["title"]
    }