import jwt
from fastapi import APIRouter, Depends, Header, HTTPException
from schemas.feedback_schema import FeedbackCreate, MessageFeedbackCreate
from services.feedback_service import save_feedback
from utils.config import settings
from typing import Optional
from middleware.auth import get_user_id
from database.mongodb import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(
    prefix="/api",
    tags=["Feedback"]
)


async def get_optional_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        return None


@router.post("/feedback")
async def submit_feedback(
    payload: FeedbackCreate,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Depends(get_optional_user_id)
):
    try:
        resolved_user_id = user_id or x_user_id or payload.userId
        result = await save_feedback(
            rating=payload.rating,
            message=payload.message,
            page_url=payload.page_url,
            user_id=resolved_user_id
        )
        return result
    except Exception as e:
        print(f"Feedback Submission Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.post("/message/{message_id}/feedback")
async def submit_message_feedback(
    message_id: str,
    payload: MessageFeedbackCreate,
    user_id: str = Depends(get_user_id)
):
    try:
        # 1. Lookup message (check by string message_id field first, then fallback to ObjectId)
        message_doc = await db.messages.find_one({"message_id": message_id})
        if not message_doc and ObjectId.is_valid(message_id):
            message_doc = await db.messages.find_one({"_id": ObjectId(message_id)})
            
        if not message_doc:
            raise HTTPException(status_code=404, detail="Message not found")

        # 2. Verify ownership via session or direct user_id check
        session_id = message_doc.get("session_id")
        session = await db.sessions.find_one({"session_id": session_id})
        if not session or session.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        # 3. Check if we want to remove the feedback
        if not payload.type or payload.type.lower() == "none":
            await db.message_feedback.delete_many({"message_id": message_id})
            await db.messages.update_one(
                {"_id": message_doc["_id"]},
                {"$unset": {"feedback": ""}}
            )
            return {"success": True, "message": "Message feedback removed successfully."}

        # 4. Save feedback document for analytics
        feedback_doc = {
            "user_id": user_id,
            "session_id": session_id,
            "message_id": message_id,
            "type": payload.type,
            "options": payload.options or [],
            "comments": payload.comments or "",
            "timestamp": payload.timestamp or (datetime.utcnow().isoformat() + "Z"),
            "userMessage": payload.userMessage,
            "assistantMessage": payload.assistantMessage,
            "messageIndex": payload.messageIndex,
            "conversation": payload.conversation or []
        }
        await db.message_feedback.insert_one(feedback_doc)

        # 5. Update the message document with the rating/feedback state
        await db.messages.update_one(
            {"_id": message_doc["_id"]},
            {"$set": {"feedback": {
                "type": payload.type,
                "options": payload.options or [],
                "comments": payload.comments or ""
            }}}
        )

        return {"success": True, "message": "Message feedback submitted successfully."}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Message Feedback Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }
