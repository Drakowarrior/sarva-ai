from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class FeedbackCreate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating must be between 1 and 5")
    message: Optional[str] = Field(None, max_length=500, description="Feedback message limit is 500 characters")
    page_url: str = Field(..., description="The URL of the page from which the feedback was sent")
    sessionId: Optional[str] = None
    userId: Optional[str] = None


class MessageFeedbackCreate(BaseModel):
    type: Optional[str] = Field(None, description="Type of feedback: 'like', 'dislike', or None to clear")
    options: Optional[List[str]] = Field(None, description="Selectable options for dislikes")
    comments: Optional[str] = Field(None, description="Optional text input for comments")
    sessionId: Optional[str] = None
    userId: Optional[str] = None
    messageId: Optional[str] = None
    timestamp: Optional[str] = None
    userMessage: Optional[str] = None
    assistantMessage: Optional[str] = None
    messageIndex: Optional[int] = None
    conversation: Optional[List[Dict[str, Any]]] = None
