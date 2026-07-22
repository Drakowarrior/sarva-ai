from pydantic import BaseModel
from typing import Optional


class SessionCreate(BaseModel):
    title: Optional[str] = "New Chat"
    session_id: Optional[str] = None


class TogglePin(BaseModel):
    pinned: bool


class ToggleFavorite(BaseModel):
    favorite: bool