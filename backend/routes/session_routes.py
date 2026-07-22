from fastapi import APIRouter, Depends, HTTPException
from schemas.session_schema import SessionCreate, TogglePin, ToggleFavorite
from middleware.auth import get_user_id, verify_session_ownership
from database.mongodb import db


from services.session_service import (
    create_session,
    get_sessions,
    delete_session,
    rename_session,
    toggle_pin_session,
    toggle_favorite_session,
    delete_all_sessions,
    duplicate_session
)

router = APIRouter(
    prefix="/api",
    tags=["Sessions"]
)


@router.post("/session/create")
async def create_new_session(
    payload: SessionCreate,
    user_id: str = Depends(get_user_id)
):
    try:
        result = await create_session(
            user_id,
            payload.title,
            payload.session_id
        )
        return result
    except Exception as e:
        print(f"Session Creation Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/sessions")
async def fetch_sessions(
    user_id: str = Depends(get_user_id)
):
    try:
        return await get_sessions(user_id)
    except Exception as e:
        print(f"Get Sessions Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.delete("/session/{session_id}")
async def remove_session(
    session_id: str,
    user_id: str = Depends(get_user_id)
):
    # Validate session ownership
    error_response = await verify_session_ownership(session_id, user_id)
    if error_response:
        # If session is already gone (404), treat deletion as success
        if getattr(error_response, "status_code", None) == 404:
            return {"success": True, "message": "Session already deleted"}
        return error_response

    try:
        return await delete_session(
            user_id,
            session_id
        )
    except Exception as e:
        print(f"Delete Session Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.patch("/session/{session_id}")
async def patch_rename_session(
    session_id: str,
    payload: SessionCreate,
    user_id: str = Depends(get_user_id)
):
    # Validate session ownership
    error_response = await verify_session_ownership(session_id, user_id)
    if error_response:
        return error_response

    try:
        return await rename_session(
            user_id,
            session_id,
            payload.title
        )
    except Exception as e:
        print(f"Rename Session Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.patch("/session/{session_id}/pin")
async def patch_pin_session(
    session_id: str,
    payload: TogglePin,
    user_id: str = Depends(get_user_id)
):
    # Validate session ownership
    error_response = await verify_session_ownership(session_id, user_id)
    if error_response:
        return error_response

    try:
        return await toggle_pin_session(
            user_id,
            session_id,
            payload.pinned
        )
    except Exception as e:
        print(f"Pin Session Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.patch("/session/{session_id}/favorite")
async def patch_favorite_session(
    session_id: str,
    payload: ToggleFavorite,
    user_id: str = Depends(get_user_id)
):
    # Validate session ownership
    error_response = await verify_session_ownership(session_id, user_id)
    if error_response:
        return error_response

    try:
        return await toggle_favorite_session(
            user_id,
            session_id,
            payload.favorite
        )
    except Exception as e:
        print(f"Favorite Session Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.delete("/sessions")
async def clear_all_sessions(
    user_id: str = Depends(get_user_id)
):
    try:
        return await delete_all_sessions(user_id)
    except Exception as e:
        print(f"Clear All Sessions Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


@router.post("/session/{session_id}/duplicate")
async def post_duplicate_session(
    session_id: str,
    user_id: str = Depends(get_user_id)
):
    # Validate session ownership
    error_response = await verify_session_ownership(session_id, user_id)
    if error_response:
        return error_response

    try:
        return await duplicate_session(user_id, session_id)
    except Exception as e:
        print(f"Duplicate Session Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


