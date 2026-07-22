import jwt
from fastapi import Header, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from database.mongodb import db
from utils.config import settings

async def get_user_id(
    request: Request,
    authorization: str = Header(None),
    x_user_id: str = Header(None)
):
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if not user_id:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token payload (user_id missing)"
                )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=401,
                detail="Session expired. Please sign in again."
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401,
                detail="Invalid token. Please sign in again."
            )
    elif x_user_id:
        user_id = x_user_id

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="User identification required (Authorization Bearer token or X-User-Id header missing)"
        )

    # Allowed endpoints for checking pending/rejected/suspended status or logging out
    allowed_paths = ["/api/auth/me", "/api/auth/logout"]
    path = request.url.path
    if path not in allowed_paths:
        user_doc = await db.users.find_one({"user_id": user_id})
        if user_doc:
            if user_doc.get("accountType") == "organization":
                status = user_doc.get("approvalStatus")
                if not status:
                    if user_doc.get("role") == "Head":
                        status = "active"
                    else:
                        member_rec = await db.organization_members.find_one({
                            "organizationId": user_doc.get("organizationId"),
                            "userId": user_id
                        })
                        if member_rec and member_rec.get("status") == "active":
                            status = "active"
                        else:
                            status = "pending"

                if status == "pending":
                    raise HTTPException(
                        status_code=403,
                        detail="Your account is pending organization approval."
                    )
                elif status == "rejected":
                    raise HTTPException(
                        status_code=403,
                        detail="Your join request was rejected by the organization administrator."
                    )
                elif status == "suspended":
                    raise HTTPException(
                        status_code=403,
                        detail="Your account has been suspended by the organization administrator."
                    )

    return user_id

async def verify_session_ownership(session_id: str, user_id: str):
    session = await db.sessions.find_one({"session_id": session_id})
    if not session:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Session not found"}
        )
    if session.get("user_id") != user_id and session.get("user_id") != "seed":
        return JSONResponse(
            status_code=403,
            content={"success": False, "message": "Access denied. You do not own this session."}
        )
    return None
