from fastapi import APIRouter, Depends

from schemas.message_schema import MessageCreate
from middleware.auth import get_user_id, verify_session_ownership

from services.message_service import (
    save_message,
    get_messages
)

router = APIRouter(
    prefix="/api",
    tags=["Messages"]
)


@router.post("/message")
async def create_message(
    payload: MessageCreate,
    user_id: str = Depends(get_user_id)
):
    # Validate session ownership
    error_response = await verify_session_ownership(payload.session_id, user_id)
    if error_response:
        return error_response

    return await save_message(
        user_id,
        payload.session_id,
        payload.role or "user",
        payload.message,
        payload.files
    )


@router.get("/messages/{session_id}")
async def fetch_messages(
    session_id: str,
    user_id: str = Depends(get_user_id)
):
    # Validate session ownership
    error_response = await verify_session_ownership(session_id, user_id)
    if error_response:
        return error_response

    return await get_messages(
        user_id,
        session_id
    )