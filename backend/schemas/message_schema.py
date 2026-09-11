from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class MessageItem(BaseModel):
    role: str
    content: str


class MessageCreate(BaseModel):
    messages: List[MessageItem]
    sessionId: str
    userId: str
    model: Optional[str] = "openai/gpt-oss-20b"
    files: Optional[List[Dict[str, Any]]] = None
    messageId: Optional[str] = None
    requestId: Optional[str] = None