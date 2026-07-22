import bcrypt
import jwt
import random
import string
from uuid import uuid4
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from pydantic import BaseModel, EmailStr, Field

from database.mongodb import db
from utils.config import settings
from middleware.auth import get_user_id

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# JWT helpers
def create_access_token(user_id: str, email: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)  # Default 7 days
    
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expire
    }
    encoded_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# Password hashing helpers
def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

import re

# Pydantic schemas
class UserRegister(BaseModel):
    username: Optional[str] = None
    fullName: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    accountType: str = "personal"  # "personal" or "organization"
    orgFlow: Optional[str] = None  # "create" or "join"
    organizationName: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    inviteCode: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str = Field(..., min_length=6, max_length=100)

class TokenResponse(BaseModel):
    success: bool
    token: str
    user: dict

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

# Routes
@router.post("/register", response_model=TokenResponse)
async def register(
    payload: UserRegister,
    request: Request,
    x_user_id: str = Header(None)
):
    email_clean = payload.email.strip().lower()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": email_clean})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    user_id = x_user_id if x_user_id else str(uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    hashed_pass = get_password_hash(payload.password)
    
    org_id = None
    user_role = None
    user_dept = None
    approval_status = "active" # personal accounts bypass approval and are automatically active
    
    # Handle Workspace selection
    if payload.accountType == "organization":
        if payload.orgFlow == "create":
            if not payload.organizationName or not payload.organizationName.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Organization Name is required to create a workspace."
                )
            
            # Check if name is duplicate
            existing_org = await db.organizations.find_one({
                "organizationName": {"$regex": f"^{re.escape(payload.organizationName.strip())}$", "$options": "i"}
            })
            if existing_org:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An organization with this name already exists."
                )
            
            org_id = f"ORG_{uuid4().hex[:8]}"
            slug = slugify(payload.organizationName)
            
            # Generate unique invite code for the organization
            invite_code = None
            while True:
                candidate_code = "INV-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
                duplicate_code_org = await db.organizations.find_one({"inviteCode": candidate_code})
                if not duplicate_code_org:
                    invite_code = candidate_code
                    break
            
            org_doc = {
                "organizationId": org_id,
                "organizationName": payload.organizationName.strip(),
                "slug": slug,
                "description": (payload.description or "").strip(),
                "industry": (payload.industry or "").strip(),
                "logo": f"/logos/default.png",
                "ownerUserId": user_id,
                "inviteCode": invite_code,
                "departments": [payload.department.strip()] if payload.department else [],
                "status": "active",
                "createdAt": now,
                "updatedAt": now
            }
            await db.organizations.insert_one(org_doc)
            
            # Creator automatically becomes role Head and Organization Owner permission
            user_role = "Head"
            user_dept = (payload.department or "Leadership").strip()
            approval_status = "active" # Owner is automatically active
            
            member_doc = {
                "organizationId": org_id,
                "userId": user_id,
                "role": user_role,
                "department": user_dept,
                "joinedAt": now,
                "status": "active"
            }
            await db.organization_members.insert_one(member_doc)
            
        elif payload.orgFlow == "join":
            if not payload.inviteCode or not payload.inviteCode.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invite code is required to join an organization."
                )
            
            invite_code_clean = payload.inviteCode.strip().upper()
            
            org = None
            invitation = await db.invitations.find_one({
                "inviteToken": invite_code_clean,
                "status": "pending"
            })
            if invitation:
                org = await db.organizations.find_one({"organizationId": invitation["organizationId"]})
                # Mark invitation accepted
                await db.invitations.update_one(
                      {"_id": invitation["_id"]},
                      {"$set": {"status": "accepted", "acceptedAt": now}}
                )
                user_role = invitation.get("role", "Student").strip()
                user_dept = invitation.get("department", "General").strip()
            else:
                # Look up organization by inviteCode
                org = await db.organizations.find_one({"inviteCode": invite_code_clean})
                user_role = (payload.role or "Student").strip()
                user_dept = (payload.department or "General").strip()
            
            if not org:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Organization not found. Please check your invite code."
                )

            if user_role == "Head" or (payload.role and payload.role.strip() == "Head"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The 'Head' role is unique and cannot be requested or assigned during join registration."
                )
            
            org_id = org["organizationId"]
            approval_status = "active" if invitation else "pending"
            
            # Check duplicate membership
            existing_member = await db.organization_members.find_one({
                "organizationId": org_id,
                "userId": user_id
            })
            if not existing_member:
                member_doc = {
                    "organizationId": org_id,
                    "userId": user_id,
                    "role": user_role,
                    "department": user_dept,
                    "joinedAt": now,
                    "status": "active" if invitation else "pending"
                }
                await db.organization_members.insert_one(member_doc)
                
                # Append department to organization departments list if new
                if user_dept not in org.get("departments", []):
                    await db.organizations.update_one(
                        {"organizationId": org_id},
                        {"$addToSet": {"departments": user_dept}}
                    )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid organization flow. Must be 'create' or 'join'."
            )
            
    user_doc = {
        "user_id": user_id,
        "fullName": payload.fullName.strip(),
        "username": payload.username.strip() if payload.username else payload.fullName.strip(),
        "email": email_clean,
        "hashed_password": hashed_pass,
        "accountType": payload.accountType,
        "organizationId": org_id,
        "role": user_role,
        "department": user_dept,
        "avatar": f"/avatars/default.png",
        "created_at": now,
        "approvalStatus": approval_status,
        "approvedBy": None,
        "approvedAt": None,
        "rejectedReason": None
    }
    
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": user_doc},
        upsert=True
    )
    
    # Generate notifications & activity logs for join request approvals
    if approval_status == "pending":
        # Create join request notification
        notif_id = f"NOTIF_{uuid4().hex[:8]}"
        await db.notifications.insert_one({
            "notificationId": notif_id,
            "notificationType": "join_request",
            "userId": user_id,
            "userName": payload.fullName.strip(),
            "userEmail": email_clean,
            "requestedRole": user_role,
            "department": user_dept,
            "organizationId": org_id,
            "status": "pending",
            "createdAt": now
        })
        
        # Create activity log
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        log_id = f"LOG_{uuid4().hex[:8]}"
        await db.activity_logs.insert_one({
            "logId": log_id,
            "action": "registration_request",
            "actorId": user_id,
            "targetUserId": user_id,
            "organizationId": org_id,
            "details": f"{payload.fullName.strip()} requested to join organization.",
            "timestamp": now,
            "ipAddress": client_ip,
            "device": "Mobile" if "Mobi" in user_agent else "Desktop"
        })
    
    # Generate Token
    token = create_access_token(user_id, email_clean)
    
    return {
        "success": True,
        "token": token,
        "user": {
            "user_id": user_id,
            "username": user_doc["username"],
            "fullName": user_doc["fullName"],
            "email": user_doc["email"],
            "accountType": user_doc["accountType"],
            "organizationId": user_doc["organizationId"],
            "role": user_doc["role"],
            "department": user_doc["department"],
            "avatar": user_doc["avatar"],
            "created_at": user_doc["created_at"],
            "approvalStatus": user_doc["approvalStatus"]
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    email_clean = payload.email.strip().lower()
    
    user_doc = await db.users.find_one({"email": email_clean})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    if not verify_password(payload.password, user_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
        
    # Generate Token
    token = create_access_token(user_doc["user_id"], user_doc["email"])
    
    org_name = None
    org_logo = None
    org_id = user_doc.get("organizationId")
    if org_id:
        org_doc = await db.organizations.find_one({"organizationId": org_id})
        if org_doc:
            org_name = org_doc.get("organizationName")
            org_logo = org_doc.get("logo")
        
    # Resolve approval status with fallback check
    approval_status = user_doc.get("approvalStatus")
    if user_doc.get("accountType") == "organization":
        if not approval_status:
            if user_doc.get("role") == "Head":
                approval_status = "active"
            else:
                member_rec = await db.organization_members.find_one({
                    "organizationId": user_doc.get("organizationId"),
                    "userId": user_doc["user_id"]
                })
                if member_rec and member_rec.get("status") == "active":
                    approval_status = "active"
                else:
                    approval_status = "pending"
    else:
        approval_status = "active"
        
    return {
        "success": True,
        "token": token,
        "user": {
            "user_id": user_doc["user_id"],
            "username": user_doc.get("username") or user_doc.get("fullName") or "",
            "fullName": user_doc.get("fullName") or user_doc.get("username") or "",
            "email": user_doc["email"],
            "accountType": user_doc.get("accountType", "personal"),
            "organizationId": user_doc.get("organizationId"),
            "organizationName": org_name,
            "organizationLogo": org_logo,
            "role": user_doc.get("role"),
            "department": user_doc.get("department"),
            "avatar": user_doc.get("avatar") or "/avatars/default.png",
            "created_at": user_doc.get("created_at"),
            "approvalStatus": approval_status
        }
    }

@router.get("/me")
async def get_current_user_profile(user_id: str = Depends(get_user_id)):
    user_doc = await db.users.find_one({"user_id": user_id})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found."
        )
    
    org_name = None
    org_logo = None
    org_id = user_doc.get("organizationId")
    if org_id:
        org_doc = await db.organizations.find_one({"organizationId": org_id})
        if org_doc:
            org_name = org_doc.get("organizationName")
            org_logo = org_doc.get("logo")
        
    # Resolve approval status with fallback check
    approval_status = user_doc.get("approvalStatus")
    if user_doc.get("accountType") == "organization":
        if not approval_status:
            if user_doc.get("role") == "Head":
                approval_status = "active"
            else:
                member_rec = await db.organization_members.find_one({
                    "organizationId": user_doc.get("organizationId"),
                    "userId": user_doc["user_id"]
                })
                if member_rec and member_rec.get("status") == "active":
                    approval_status = "active"
                else:
                    approval_status = "pending"
    else:
        approval_status = "active"

    return {
        "success": True,
        "user": {
            "user_id": user_doc["user_id"],
            "username": user_doc.get("username") or user_doc.get("fullName") or "",
            "fullName": user_doc.get("fullName") or user_doc.get("username") or "",
            "email": user_doc["email"],
            "accountType": user_doc.get("accountType", "personal"),
            "organizationId": user_doc.get("organizationId"),
            "organizationName": org_name,
            "organizationLogo": org_logo,
            "role": user_doc.get("role"),
            "department": user_doc.get("department"),
            "avatar": user_doc.get("avatar") or "/avatars/default.png",
            "created_at": user_doc.get("created_at"),
            "approvalStatus": approval_status,
            "phoneNumber": user_doc.get("phoneNumber") or "",
            "designation": user_doc.get("designation") or "",
            "bio": user_doc.get("bio") or "",
            "location": user_doc.get("location") or "",
            "timezone": user_doc.get("timezone") or "UTC"
        }
    }


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    email_clean = payload.email.strip().lower()
    user = await db.users.find_one({"email": email_clean})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user registered with this email address."
        )
    
    # Generate random 6-character uppercase alphanumeric code
    reset_token = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    expire_time = datetime.utcnow() + timedelta(minutes=15)
    
    await db.users.update_one(
        {"email": email_clean},
        {
            "$set": {
                "reset_token": reset_token,
                "reset_token_expires": expire_time
            }
        }
    )
    
    # Log it to backend stdout for administrative verification
    print(f"\n[SECURITY] Password reset requested for {email_clean}. Reset Token: {reset_token}\n")
    
    return {
        "success": True,
        "message": "Password reset token generated.",
        "demo_token": reset_token  # Expose directly for demo/local environment ease-of-use
    }

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    email_clean = payload.email.strip().lower()
    user = await db.users.find_one({"email": email_clean})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user registered with this email address."
        )
        
    db_token = user.get("reset_token")
    db_token_expires = user.get("reset_token_expires")
    
    if not db_token or db_token != payload.token.strip().upper():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid security reset code."
        )
        
    if not db_token_expires or datetime.utcnow() > db_token_expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security reset code has expired. Please request a new one."
        )
        
    # Valid token! Update password and clear reset token
    hashed_pass = get_password_hash(payload.new_password)
    
    await db.users.update_one(
        {"email": email_clean},
        {
            "$set": {
                "hashed_password": hashed_pass
            },
            "$unset": {
                "reset_token": "",
                "reset_token_expires": ""
            }
        }
    )
    
    return {
        "success": True,
        "message": "Password reset successfully. You can now log in with your new password."
    }
