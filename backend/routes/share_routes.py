from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import uuid4
from datetime import datetime
from database.mongodb import db
from middleware.auth import get_user_id

router = APIRouter(
    prefix="/api",
    tags=["Share"]
)

class ChatShareRequest(BaseModel):
    sessionId: str
    sharedBy: str
    shareWith: List[str]
    shareType: str = "copy"
    permission: str = "read_write"
    timestamp: Optional[str] = None

@router.post("/share")
async def share_chat(
    payload: ChatShareRequest,
    user_id: str = Depends(get_user_id)
):
    try:
        # 1. Verify Sender Authentication & Payload
        if payload.sharedBy != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sender identity mismatch with authenticated user."
            )
            
        # 2. Confirm sender owns the chat
        session = await db.sessions.find_one({"session_id": payload.sessionId})
        if not session or session.get("user_id") != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not own this chat session or it does not exist."
            )
            
        if not payload.shareWith:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No recipient users specified."
            )

        # Lookup sender name/username for UI attribution
        sender_user = await db.users.find_one({"user_id": user_id})
        sender_name = (sender_user.get("name") or sender_user.get("username") or "Someone") if sender_user else "Someone"

        copied_session_ids = []
        now = datetime.utcnow().isoformat() + "Z"

        for recipient_id in payload.shareWith:
            if recipient_id == user_id:
                # Skip self-sharing
                continue
                
            # Verify recipient exists
            recipient = await db.users.find_one({"user_id": recipient_id})
            if not recipient:
                continue
                
            new_session_id = f"copied_{uuid4().hex[:8]}_{int(datetime.utcnow().timestamp() * 1000)}"
            
            new_session = {
                "user_id": recipient_id,
                "ownerUserId": recipient_id,
                "session_id": new_session_id,
                "title": session.get("title", "Shared Chat"),
                "pinned": False,
                "favorite": False,
                "last_message": session.get("last_message", ""),
                "created_at": now,
                "updated_at": now,
                "isShared": True,
                "sharedBy": sender_name,
                "originalSessionId": payload.sessionId
            }
            await db.sessions.insert_one(new_session)
            
            # Copy the complete conversation preserving order
            original_messages = await db.messages.find(
                {"session_id": payload.sessionId}
            ).sort("timestamp", 1).to_list(length=None)
            
            new_messages = []
            for index, msg in enumerate(original_messages):
                content_val = msg.get("message") or msg.get("content") or ""
                new_msg = {
                    "user_id": recipient_id,
                    "session_id": new_session_id,
                    "role": msg.get("role"),
                    "message": content_val,
                    "content": content_val,
                    "files": msg.get("files") or [],
                    "timestamp": msg.get("timestamp") or datetime.utcnow().isoformat() + "Z",
                    "messageIndex": index
                }
                new_messages.append(new_msg)
                
            if new_messages:
                await db.messages.insert_many(new_messages)
                
            # Store sharing metadata
            share_doc = {
                "originalSessionId": payload.sessionId,
                "copiedSessionId": new_session_id,
                "sharedByUserId": user_id,
                "sharedWithUserId": recipient_id,
                "sharedAt": payload.timestamp or now,
                "permission": payload.permission,
                "status": "accepted",
                "acceptedAt": now
            }
            await db.chat_shares.insert_one(share_doc)
            copied_session_ids.append(new_session_id)
            
        return {
            "success": True,
            "message": f"Chat shared successfully with {len(copied_session_ids)} users.",
            "copiedSessionIds": copied_session_ids
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Share Chat Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while sharing the chat: {str(e)}"
        )
