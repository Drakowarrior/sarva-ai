from database.mongodb import db
from uuid import uuid4
from datetime import datetime
from typing import Optional


async def save_feedback(rating: Optional[int], message: Optional[str], page_url: str, user_id: Optional[str] = None):
    feedback_id = str(uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    
    feedback_doc = {
        "feedback_id": feedback_id,
        "user_id": user_id,
        "rating": rating,
        "message": message,
        "page_url": page_url,
        "timestamp": now
    }
    
    await db.feedback.insert_one(feedback_doc)
    
    return {
        "success": True,
        "feedback_id": feedback_id,
        "rating": rating,
        "message": message,
        "page_url": page_url,
        "timestamp": now
    }
