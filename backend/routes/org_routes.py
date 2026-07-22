import re
import random
import string
from uuid import uuid4
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from pydantic import BaseModel, EmailStr, Field

from database.mongodb import db
from middleware.auth import get_user_id

router = APIRouter(
    prefix="/api/organizations",
    tags=["Organizations"]
)


# Schemas
class OrganizationUpdate(BaseModel):
    organizationName: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    logo: Optional[str] = None
    banner: Optional[str] = None
    favicon: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class TransferOwnershipPayload(BaseModel):
    targetUserId: str

class MemberUpdatePayload(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None  # "active" or "archived"
    avatar: Optional[str] = None

class BulkRolePayload(BaseModel):
    userIds: List[str]
    role: str

class BulkRemovePayload(BaseModel):
    userIds: List[str]

class BulkArchivePayload(BaseModel):
    userIds: List[str]
    archive: bool

class BulkInvitePayload(BaseModel):
    emails: List[EmailStr]
    role: str = "Student"
    department: str = "General"

class DepartmentCreatePayload(BaseModel):
    name: str

class DepartmentRenamePayload(BaseModel):
    oldName: str
    newName: str

# Helper: log activity to db
async def log_activity(org_id: str, user_id: str, action: str, details: str, request: Request = None):
    ip = None
    device = "Desktop"
    if request:
        if request.client:
            ip = request.client.host
        ua = request.headers.get("user-agent", "").lower()
        if "mobile" in ua:
            device = "Mobile"
        elif "tablet" in ua:
            device = "Tablet"
            
    user = await db.users.find_one({"user_id": user_id})
    user_name = (user.get("fullName") or user.get("username") or "System") if user else "System"
    
    await db.activity_logs.insert_one({
        "organizationId": org_id,
        "userId": user_id,
        "userName": user_name,
        "action": action,
        "details": details,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "ipAddress": ip,
        "device": device
    })

# Helper: verify user exists and return user doc
async def get_user_and_verify_org(user_id: str) -> dict:
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    if not user.get("organizationId"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not belong to any organization workspace."
        )
    return user

# Helper: verify role permissions
def verify_role(user_role: str, allowed_roles: List[str], error_message: str = "Access denied."):
    if user_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=error_message
        )

# Helper: Default Organization Settings
DEFAULT_SETTINGS = {
    "branding": {"primaryColor": "#38bdf8", "theme": "dark"},
    "generalSettings": {"defaultRole": "Student"},
    "invitationRules": {"allowTeamLeadInvite": False},
    "memberVisibility": {"showAllDepartments": True},
    "chatSharingPolicies": {"allowExternalSharing": False}
}

# Endpoints
@router.get("/my")
async def get_my_organization(user_id: str = Depends(get_user_id)):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    
    org = await db.organizations.find_one({"organizationId": org_id})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found."
        )
        
    # Count members
    total_members = await db.organization_members.count_documents({"organizationId": org_id})
    active_members = await db.organization_members.count_documents({"organizationId": org_id, "status": "active"})
    pending_approvals = await db.users.count_documents({"organizationId": org_id, "approvalStatus": "pending"})
    departments_count = len(org.get("departments") or [])
    
    # Get creator details
    creator_name = "System"
    if org.get("ownerUserId"):
        creator = await db.users.find_one({"user_id": org["ownerUserId"]})
        if creator:
            creator_name = creator.get("fullName") or creator.get("username") or "System"
            
    # Activity log preview (last 5 entries)
    activity_cursor = db.activity_logs.find({"organizationId": org_id}).sort("timestamp", -1).limit(5)
    recent_activities = []
    async for act in activity_cursor:
        recent_activities.append({
            "userName": act.get("userName") or act.get("actorId") or "System",
            "action": act.get("action"),
            "details": act.get("details"),
            "timestamp": act.get("timestamp")
        })

    # Fetch total shared chats
    member_ids_cursor = db.organization_members.find({"organizationId": org_id})
    member_ids = [m["userId"] async for m in member_ids_cursor]
    shared_chats_count = await db.sessions.count_documents({"user_id": {"$in": member_ids}, "isShared": True})

    return {
        "success": True,
        "organization": {
            "organizationId": org["organizationId"],
            "organizationName": org["organizationName"],
            "slug": org.get("slug", ""),
            "description": org.get("description", ""),
            "industry": org.get("industry", ""),
            "website": org.get("website", ""),
            "logo": org.get("logo") or "/logos/default.png",
            "banner": org.get("banner") or "",
            "favicon": org.get("favicon") or "",
            "ownerUserId": org.get("ownerUserId"),
            "createdBy": creator_name,
            "createdDate": org.get("createdAt"),
            "totalMembers": total_members,
            "activeMembers": active_members,
            "departments": org.get("departments") or [],
            "status": org.get("status") or "active",
            "inviteCode": org.get("inviteCode", ""),
            "settings": org.get("settings") or DEFAULT_SETTINGS
        },
        "analytics": {
            "totalMembers": total_members,
            "activeMembers": active_members,
            "pendingApprovals": pending_approvals,
            "departmentsCount": departments_count,
            "sharedChatsCount": shared_chats_count,
            "recentActivities": recent_activities
        }
    }

@router.put("/my")
async def update_my_organization(
    payload: OrganizationUpdate,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Head and HR roles have editing rights
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can edit organization settings.")
        
    org = await db.organizations.find_one({"organizationId": org_id})
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found."
        )
        
    update_data = {}
    
    # If role is HR, protect critical security settings
    if user_role == "HR" and payload.settings:
        # Prevent HR from editing chat sharing policies or general security settings
        existing_settings = org.get("settings") or DEFAULT_SETTINGS
        incoming_settings = payload.settings
        
        # Merge safely while overriding forbidden properties
        safe_settings = existing_settings.copy()
        if "branding" in incoming_settings:
            safe_settings["branding"] = incoming_settings["branding"]
        if "generalSettings" in incoming_settings:
            safe_settings["generalSettings"] = incoming_settings["generalSettings"]
        if "invitationRules" in incoming_settings:
            safe_settings["invitationRules"] = incoming_settings["invitationRules"]
        if "memberVisibility" in incoming_settings:
            safe_settings["memberVisibility"] = incoming_settings["memberVisibility"]
            
        update_data["settings"] = safe_settings
    elif payload.settings is not None:
        update_data["settings"] = payload.settings

    if payload.organizationName is not None:
        name_clean = payload.organizationName.strip()
        if not name_clean:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization name cannot be empty."
            )
        # Check duplicate
        existing_org = await db.organizations.find_one({
            "organizationId": {"$ne": org_id},
            "organizationName": {"$regex": f"^{re.escape(name_clean)}$", "$options": "i"}
        })
        if existing_org:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An organization with this name already exists."
            )
        update_data["organizationName"] = name_clean
        
        # Update slug
        text = name_clean.lower().strip()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[\s_-]+', '-', text)
        update_data["slug"] = text
        
    if payload.description is not None:
        update_data["description"] = payload.description.strip()
    if payload.industry is not None:
        update_data["industry"] = payload.industry.strip()
    if payload.website is not None:
        update_data["website"] = payload.website.strip()
    if payload.logo is not None:
        update_data["logo"] = payload.logo.strip()
    if payload.banner is not None:
        update_data["banner"] = payload.banner.strip()
    if payload.favicon is not None:
        update_data["favicon"] = payload.favicon.strip()
        
    if update_data:
        update_data["updatedAt"] = datetime.utcnow().isoformat() + "Z"
        await db.organizations.update_one(
            {"organizationId": org_id},
            {"$set": update_data}
        )
        await log_activity(org_id, user_id, "organization_updated", f"Organization profile settings updated by {user_role}.", request)
        
    return {
        "success": True,
        "message": "Organization updated successfully."
    }

@router.delete("/my")
async def delete_organization(
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Only Head can delete organization workspace
    verify_role(user_role, ["Head"], "Only the organization Head can delete the workspace.")
    
    # 1. Reset all users mapped to this org
    await db.users.update_many(
        {"organizationId": org_id},
        {
            "$set": {
                "accountType": "personal",
                "organizationId": None,
                "role": None,
                "department": None
            }
        }
    )
    
    # 2. Clear members
    await db.organization_members.delete_many({"organizationId": org_id})
    
    # 3. Clear invitations
    await db.invitations.delete_many({"organizationId": org_id})
    
    # 4. Clear activity logs
    await db.activity_logs.delete_many({"organizationId": org_id})
    
    # 5. Delete organization doc itself
    await db.organizations.delete_one({"organizationId": org_id})
    
    return {
        "success": True,
        "message": "Organization deleted successfully. All members demoted to personal workspaces."
    }

@router.post("/transfer")
async def transfer_ownership(
    payload: TransferOwnershipPayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Only Head can transfer ownership
    verify_role(user_role, ["Head"], "Only the organization Head can transfer ownership.")
    
    target_user_id = payload.targetUserId
    if target_user_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot transfer ownership to yourself.")
        
    # Check if target user is in the organization
    target_member = await db.organization_members.find_one({"organizationId": org_id, "userId": target_user_id})
    if not target_member:
        raise HTTPException(status_code=404, detail="Target user is not a member of this organization.")
        
    # Promote target user to Head
    await db.organization_members.update_one(
        {"organizationId": org_id, "userId": target_user_id},
        {"$set": {"role": "Head"}}
    )
    await db.users.update_one(
        {"user_id": target_user_id},
        {"$set": {"role": "Head"}}
    )
    
    # Demote old Head to Team Lead
    await db.organization_members.update_one(
        {"organizationId": org_id, "userId": user_id},
        {"$set": {"role": "Team Lead"}}
    )
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"role": "Team Lead"}}
    )
    
    # Update organization owner field
    await db.organizations.update_one(
        {"organizationId": org_id},
        {"$set": {"ownerUserId": target_user_id}}
    )
    
    target_doc = await db.users.find_one({"user_id": target_user_id})
    target_name = target_doc.get("fullName") or target_doc.get("username") or "Member"
    
    await log_activity(org_id, user_id, "ownership_transferred", f"Organization ownership transferred to {target_name}.", request)
    
    return {
        "success": True,
        "message": f"Ownership successfully transferred to {target_name}."
    }

@router.get("/members")
async def get_organization_members(user_id: str = Depends(get_user_id)):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    
    cursor = db.organization_members.find({"organizationId": org_id})
    members = []
    async for m in cursor:
        m_user = await db.users.find_one({"user_id": m["userId"]})
        if m_user:
            members.append({
                "userId": m["userId"],
                "name": m_user.get("fullName") or m_user.get("username") or "Unknown",
                "email": m_user.get("email") or "",
                "role": m.get("role", "Student"),
                "department": m.get("department", "General"),
                "joinedAt": m.get("joinedAt"),
                "avatar": m_user.get("avatar") or "/avatars/default.png",
                "status": m.get("status", "active")
            })
            
    return {
        "success": True,
        "members": members
    }

@router.patch("/members/{target_user_id}")
async def update_member_details(
    target_user_id: str,
    payload: MemberUpdatePayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Restrict editing to Head & HR
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can edit member profiles.")
    
    # Check if target is a member of the organization
    target_member = await db.organization_members.find_one({"organizationId": org_id, "userId": target_user_id})
    if not target_member:
        raise HTTPException(status_code=404, detail="Member not found in this organization.")
        
    # Check HR constraints
    if user_role == "HR":
        # HR cannot modify Head's account
        if target_member.get("role") == "Head":
            raise HTTPException(status_code=403, detail="HR role cannot modify the organization Head.")
        # HR cannot modify another HR's account
        if target_member.get("role") == "HR":
            raise HTTPException(status_code=403, detail="HR role cannot modify another HR member.")
        # HR cannot promote another member to Head or HR
        if payload.role == "Head":
            raise HTTPException(status_code=403, detail="HR role cannot promote members to organization Head.")
        if payload.role == "HR":
            raise HTTPException(status_code=403, detail="HR role cannot promote another member to HR.")
            
    # Populate updates
    member_updates = {}
    user_updates = {}
    
    if payload.role is not None:
        valid_roles = ["Head", "Team Lead", "HR", "Executive", "Intern", "Student"]
        if payload.role not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {valid_roles}")
            
        # Demotion / promotion protection for unique Head role
        if payload.role == "Head" and target_member.get("role") != "Head":
            raise HTTPException(
                status_code=400,
                detail="Assigning the 'Head' role is only allowed via the ownership transfer protocol."
            )
        if target_member.get("role") == "Head" and payload.role != "Head":
            raise HTTPException(
                status_code=400,
                detail="The Head role cannot be changed directly. Use the transfer ownership protocol."
            )

        member_updates["role"] = payload.role
        user_updates["role"] = payload.role
        
    if payload.department is not None:
        member_updates["department"] = payload.department
        user_updates["department"] = payload.department
        # Auto append department to organization departments list
        await db.organizations.update_one(
            {"organizationId": org_id},
            {"$addToSet": {"departments": payload.department}}
        )
        
    if payload.status is not None:
        valid_statuses = ["active", "archived"]
        if payload.status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid status.")
        member_updates["status"] = payload.status
        
    if payload.name is not None:
        user_updates["fullName"] = payload.name
        
    if payload.avatar is not None:
        user_updates["avatar"] = payload.avatar
        
    if member_updates:
        await db.organization_members.update_one(
            {"organizationId": org_id, "userId": target_user_id},
            {"$set": member_updates}
        )
    if user_updates:
        await db.users.update_one(
            {"user_id": target_user_id},
            {"$set": user_updates}
        )
        
    target_user_doc = await db.users.find_one({"user_id": target_user_id})
    target_name = (target_user_doc.get("fullName") or target_user_doc.get("username") or "Member") if target_user_doc else "Member"
    
    await log_activity(org_id, user_id, "member_updated", f"Updated details for member {target_name}.", request)
    
    return {
        "success": True,
        "message": f"Member {target_name} updated successfully."
    }

@router.delete("/members/{target_user_id}")
async def remove_member(
    target_user_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Head and HR can remove members
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can remove members.")
    
    if target_user_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot remove yourself from the organization."
        )
        
    # Check membership
    target_member = await db.organization_members.find_one({
        "organizationId": org_id,
        "userId": target_user_id
    })
    if not target_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this organization."
        )
        
    # Check HR constraints
    if user_role == "HR":
        if target_member.get("role") == "Head":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="HR role cannot remove the organization Head."
            )
        if target_member.get("role") == "HR":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="HR role cannot remove another HR member."
            )
        
    # Remove member
    await db.organization_members.delete_one({
        "organizationId": org_id,
        "userId": target_user_id
    })
    
    # Reset user record mapping
    await db.users.update_one(
        {"user_id": target_user_id},
        {
            "$set": {
                "accountType": "personal",
                "organizationId": None,
                "role": None,
                "department": None
            }
        }
    )
    
    target_doc = await db.users.find_one({"user_id": target_user_id})
    target_name = (target_doc.get("fullName") or target_doc.get("username") or "Member") if target_doc else "Member"
    
    await log_activity(org_id, user_id, "member_removed", f"Removed member {target_name} from organization.", request)
    
    return {
        "success": True,
        "message": "Member removed from organization successfully."
    }

@router.post("/members/{target_user_id}/archive")
async def archive_member(
    target_user_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Head and HR can archive members
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can archive members.")
    
    if target_user_id == user_id:
        raise HTTPException(status_code=400, detail="You cannot archive yourself.")
        
    target_member = await db.organization_members.find_one({"organizationId": org_id, "userId": target_user_id})
    if not target_member:
        raise HTTPException(status_code=404, detail="Member not found.")
        
    if user_role == "HR":
        if target_member.get("role") == "Head":
            raise HTTPException(status_code=403, detail="HR role cannot archive the Head.")
        if target_member.get("role") == "HR":
            raise HTTPException(status_code=403, detail="HR role cannot archive another HR member.")
        
    await db.organization_members.update_one(
        {"organizationId": org_id, "userId": target_user_id},
        {"$set": {"status": "archived"}}
    )
    
    target_doc = await db.users.find_one({"user_id": target_user_id})
    target_name = target_doc.get("fullName") or target_doc.get("username") or "Member"
    
    await log_activity(org_id, user_id, "member_archived", f"Archived member {target_name}.", request)
    
    return {"success": True, "message": f"Member {target_name} archived successfully."}

@router.post("/members/{target_user_id}/restore")
async def restore_member(
    target_user_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Head and HR can restore members
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can restore members.")
    
    target_member = await db.organization_members.find_one({"organizationId": org_id, "userId": target_user_id})
    if not target_member:
        raise HTTPException(status_code=404, detail="Member not found.")
        
    # Check HR constraints
    if user_role == "HR":
        if target_member.get("role") == "Head":
            raise HTTPException(status_code=403, detail="HR role cannot restore the Head.")
        if target_member.get("role") == "HR":
            raise HTTPException(status_code=403, detail="HR role cannot restore another HR member.")

    await db.organization_members.update_one(
        {"organizationId": org_id, "userId": target_user_id},
        {"$set": {"status": "active"}}
    )
    
    target_doc = await db.users.find_one({"user_id": target_user_id})
    target_name = target_doc.get("fullName") or target_doc.get("username") or "Member"
    
    await log_activity(org_id, user_id, "member_restored", f"Restored archived member {target_name}.", request)
    
    return {"success": True, "message": f"Member {target_name} restored successfully."}

# Bulk operations
@router.patch("/members/bulk-role")
async def bulk_update_role(
    payload: BulkRolePayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can perform bulk role updates.")
    
    if payload.role == "Head":
        raise HTTPException(
            status_code=403,
            detail="The Head role is unique and cannot be bulk assigned. Use the transfer ownership protocol instead."
        )
        
    # Filter out target IDs based on roles
    target_ids = payload.userIds.copy()
    if user_id in target_ids:
        target_ids.remove(user_id) # Skip self
        
    members_to_update = []
    cursor = db.organization_members.find({"organizationId": org_id, "userId": {"$in": target_ids}})
    async for m in cursor:
        if m.get("role") == "Head":
            continue # Cannot modify Head's role bulk-wise
        if user_role == "HR" and (m.get("role") == "HR" or payload.role == "HR"):
            continue # HR cannot update other HRs or bulk assign HR role
        members_to_update.append(m["userId"])
        
    if not members_to_update:
        return {"success": False, "message": "No valid members to update."}
        
    await db.organization_members.update_many(
        {"organizationId": org_id, "userId": {"$in": members_to_update}},
        {"$set": {"role": payload.role}}
    )
    await db.users.update_many(
        {"user_id": {"$in": members_to_update}},
        {"$set": {"role": payload.role}}
    )
    
    await log_activity(org_id, user_id, "bulk_role_updated", f"Bulk updated {len(members_to_update)} members to role {payload.role}.", request)
    
    return {"success": True, "message": f"Role updated for {len(members_to_update)} members."}

@router.post("/members/bulk-remove")
async def bulk_remove_members(
    payload: BulkRemovePayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can bulk remove members.")
    
    target_ids = payload.userIds.copy()
    if user_id in target_ids:
        target_ids.remove(user_id) # Cannot remove self
        
    members_to_remove = []
    cursor = db.organization_members.find({"organizationId": org_id, "userId": {"$in": target_ids}})
    async for m in cursor:
        if user_role == "HR" and m.get("role") == "Head":
            continue # HR cannot remove Head
        members_to_remove.append(m["userId"])
        
    if not members_to_remove:
        return {"success": False, "message": "No valid members to remove."}
        
    await db.organization_members.delete_many(
        {"organizationId": org_id, "userId": {"$in": members_to_remove}}
    )
    await db.users.update_many(
        {"user_id": {"$in": members_to_remove}},
        {
            "$set": {
                "accountType": "personal",
                "organizationId": None,
                "role": None,
                "department": None
            }
        }
    )
    
    await log_activity(org_id, user_id, "bulk_members_removed", f"Bulk removed {len(members_to_remove)} members from the organization.", request)
    
    return {"success": True, "message": f"Removed {len(members_to_remove)} members."}

@router.post("/members/bulk-archive")
async def bulk_archive_members(
    payload: BulkArchivePayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can bulk archive/restore members.")
    
    target_ids = payload.userIds.copy()
    if user_id in target_ids:
        target_ids.remove(user_id)
        
    members_to_archive = []
    cursor = db.organization_members.find({"organizationId": org_id, "userId": {"$in": target_ids}})
    async for m in cursor:
        if user_role == "HR" and m.get("role") in ["Head", "HR"]:
            continue
        members_to_archive.append(m["userId"])
        
    if not members_to_archive:
        return {"success": False, "message": "No valid members to update."}
        
    status_val = "archived" if payload.archive else "active"
    await db.organization_members.update_many(
        {"organizationId": org_id, "userId": {"$in": members_to_archive}},
        {"$set": {"status": status_val}}
    )
    
    action_type = "bulk_archived" if payload.archive else "bulk_restored"
    await log_activity(org_id, user_id, action_type, f"Bulk status set to {status_val} for {len(members_to_archive)} members.", request)
    
    return {"success": True, "message": f"Updated status to {status_val} for {len(members_to_archive)} members."}

# Invite updates
@router.post("/invite")
async def invite_members_bulk(
    payload: BulkInvitePayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Head and HR can invite members
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can invite members.")
    
    if payload.role == "Head":
        raise HTTPException(status_code=400, detail="Cannot invite members as Head.")
    if user_role == "HR" and payload.role == "HR":
        raise HTTPException(status_code=403, detail="HR role cannot invite another HR member.")
        
    results = []
    now = datetime.utcnow().isoformat() + "Z"
    
    for email in payload.emails:
        email_clean = email.strip().lower()
        if not email_clean:
            continue
            
        # Check duplicate
        user_to_invite = await db.users.find_one({"email": email_clean})
        if user_to_invite:
            already_member = await db.organization_members.find_one({
                "organizationId": org_id,
                "userId": user_to_invite["user_id"]
            })
            if already_member:
                continue
                
        invite_token = "INV-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        expire_time = datetime.utcnow() + timedelta(days=7)
        
        invitation_doc = {
            "organizationId": org_id,
            "invitedBy": user_id,
            "invitedEmail": email_clean,
            "inviteToken": invite_token,
            "role": payload.role,
            "department": payload.department,
            "status": "pending",
            "expiresAt": expire_time.isoformat() + "Z",
            "createdAt": now
        }
        await db.invitations.insert_one(invitation_doc)
        results.append({"email": email_clean, "code": invite_token})
        
        # Log to stdout
        print(f"\n[SECURITY] Invitation generated for {email_clean} to join {org_id} (Role: {payload.role}, Dept: {payload.department}). Invite Code: {invite_token}\n")
        
    if results:
        # Also auto add department to org
        await db.organizations.update_one(
            {"organizationId": org_id},
            {"$addToSet": {"departments": payload.department}}
        )
        await log_activity(org_id, user_id, "members_invited", f"Generated invitations for {len(results)} email addresses.", request)
        
    return {
        "success": True,
        "message": f"Successfully generated {len(results)} invitations.",
        "invitations": results
    }

@router.get("/invitations")
async def get_active_invitations(user_id: str = Depends(get_user_id)):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head", "HR"], "Access denied to active invitations.")
        
    cursor = db.invitations.find({"organizationId": org_id, "status": "pending"})
    invites = []
    async for inv in cursor:
        invites.append({
            "id": str(inv["_id"]),
            "invitedEmail": inv["invitedEmail"],
            "inviteToken": inv["inviteToken"],
            "role": inv.get("role", "Student"),
            "department": inv.get("department", "General"),
            "createdAt": inv["createdAt"],
            "expiresAt": inv["expiresAt"]
        })
        
    return {
        "success": True,
        "invitations": invites
    }

@router.delete("/invitations/{invitation_id}")
async def cancel_invitation(
    invitation_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    from bson import ObjectId
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can cancel invitations.")
    
    try:
        oid = ObjectId(invitation_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid invitation ID.")
        
    inv = await db.invitations.find_one({"_id": oid, "organizationId": org_id})
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found.")
        
    await db.invitations.delete_one({"_id": oid})
    
    await log_activity(org_id, user_id, "invitation_cancelled", f"Cancelled invitation for {inv.get('invitedEmail')}.", request)
    
    return {"success": True, "message": "Invitation cancelled successfully."}

# Departments management
@router.post("/departments")
async def create_department(
    payload: DepartmentCreatePayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can create departments.")
    
    dept_name = payload.name.strip()
    if not dept_name:
        raise HTTPException(status_code=400, detail="Department name cannot be empty.")
        
    org = await db.organizations.find_one({"organizationId": org_id})
    if dept_name in org.get("departments", []):
        raise HTTPException(status_code=400, detail="Department already exists.")
        
    await db.organizations.update_one(
        {"organizationId": org_id},
        {"$addToSet": {"departments": dept_name}}
    )
    
    await log_activity(org_id, user_id, "department_created", f"Created department '{dept_name}'.", request)
    
    return {"success": True, "message": f"Department '{dept_name}' created successfully."}

@router.put("/departments")
async def rename_department(
    payload: DepartmentRenamePayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head"], "Only the organization Head can rename departments.")
    
    old_name = payload.oldName.strip()
    new_name = payload.newName.strip()
    
    if not old_name or not new_name:
        raise HTTPException(status_code=400, detail="Department names cannot be empty.")
        
    org = await db.organizations.find_one({"organizationId": org_id})
    departments = org.get("departments") or []
    
    if old_name not in departments:
        raise HTTPException(status_code=404, detail="Original department not found.")
    if new_name in departments:
        raise HTTPException(status_code=400, detail="A department with the new name already exists.")
        
    # Replace in org doc
    updated_depts = [new_name if d == old_name else d for d in departments]
    await db.organizations.update_one(
        {"organizationId": org_id},
        {"$set": {"departments": updated_depts}}
    )
    
    # Update members mapping
    await db.organization_members.update_many(
        {"organizationId": org_id, "department": old_name},
        {"$set": {"department": new_name}}
    )
    await db.users.update_many(
        {"organizationId": org_id, "department": old_name},
        {"$set": {"department": new_name}}
    )
    
    await log_activity(org_id, user_id, "department_renamed", f"Renamed department '{old_name}' to '{new_name}'.", request)
    
    return {"success": True, "message": f"Department renamed to '{new_name}' successfully."}

@router.delete("/departments/{dept_name}")
async def delete_department(
    dept_name: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    verify_role(user_role, ["Head"], "Only the organization Head can delete departments.")
    
    org = await db.organizations.find_one({"organizationId": org_id})
    departments = org.get("departments") or []
    
    if dept_name not in departments:
        raise HTTPException(status_code=404, detail="Department not found.")
        
    # Pull from org doc
    await db.organizations.update_one(
        {"organizationId": org_id},
        {"$pull": {"departments": dept_name}}
    )
    
    # Demote department members to 'General'
    await db.organization_members.update_many(
        {"organizationId": org_id, "department": dept_name},
        {"$set": {"department": "General"}}
    )
    await db.users.update_many(
        {"organizationId": org_id, "department": dept_name},
        {"$set": {"department": "General"}}
    )
    
    await log_activity(org_id, user_id, "department_deleted", f"Deleted department '{dept_name}'. Members reassigned to 'General'.", request)
    
    return {"success": True, "message": f"Department '{dept_name}' deleted successfully."}

# Logs
@router.get("/logs")
async def get_activity_logs(user_id: str = Depends(get_user_id)):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    # Restrict logs to Head & HR
    verify_role(user_role, ["Head", "HR"], "Only Head and HR roles can view activity logs.")
    
    cursor = db.activity_logs.find({"organizationId": org_id}).sort("timestamp", -1).limit(200)
    logs = []
    async for l in cursor:
        logs.append({
            "id": str(l["_id"]),
            "userId": l.get("userId") or l.get("user_id") or "system",
            "userName": l.get("userName") or "Unknown",
            "action": l.get("action") or "Unknown Action",
            "details": l.get("details") or "",
            "timestamp": l.get("timestamp") or "",
            "ipAddress": l.get("ipAddress"),
            "device": l.get("device")
        })
        
    return {"success": True, "logs": logs}

# Shared Chats
@router.get("/shared-chats")
async def get_org_shared_chats(user_id: str = Depends(get_user_id)):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    user_dept = user.get("department")
    
    # 1. Fetch all members of the organization
    member_ids_cursor = db.organization_members.find({"organizationId": org_id})
    members_map = {}
    async for m in member_ids_cursor:
        members_map[m["userId"]] = {
            "role": m.get("role"),
            "department": m.get("department")
        }
        
    # 2. Query sessions that are shared and belong to organization members
    cursor = db.sessions.find({
        "user_id": {"$in": list(members_map.keys())},
        "isShared": True
    }).sort("updated_at", -1)
    
    chats = []
    async for s in cursor:
        owner_id = s["user_id"]
        owner_info = members_map.get(owner_id) or {}
        
        # Enforce Team Lead department restriction: Team Leads can only see their department's chats
        if user_role == "Team Lead" and owner_info.get("department") != user_dept:
            continue
            
        chats.append({
            "sessionId": s["session_id"],
            "title": s["title"],
            "lastMessage": s.get("last_message", ""),
            "updatedAt": s.get("updated_at"),
            "sharedBy": s.get("sharedBy", "Someone"),
            "ownerUserId": owner_id,
            "ownerDepartment": owner_info.get("department", "General"),
            "ownerRole": owner_info.get("role", "Student")
        })
        
    return {"success": True, "chats": chats}

@router.delete("/shared-chats/{session_id}")
async def delete_org_shared_chat(
    session_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    user_dept = user.get("department")
    
    # Check if session exists
    session = await db.sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Shared chat session not found.")
        
    session_owner_id = session.get("user_id")
    
    # Verify owner belongs to org
    owner_member = await db.organization_members.find_one({"organizationId": org_id, "userId": session_owner_id})
    if not owner_member:
        raise HTTPException(status_code=403, detail="Shared chat session does not belong to this organization.")
        
    # Enforce permission rules:
    # Head & HR can delete any shared chat.
    # Team Lead can delete department shared chats.
    # Others can only delete their own chats.
    allowed = False
    if user_role in ["Head", "HR"]:
        allowed = True
    elif user_role == "Team Lead" and owner_member.get("department") == user_dept:
        allowed = True
    elif session_owner_id == user_id:
        allowed = True
        
    if not allowed:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this shared chat.")
        
    # Delete session
    await db.sessions.delete_one({"session_id": session_id})
    # Delete messages
    await db.messages.delete_many({"session_id": session_id})
    
    # Delete share metadata if exists
    await db.chat_shares.delete_many({
        "$or": [
            {"copiedSessionId": session_id},
            {"originalSessionId": session_id}
        ]
    })
    
    await log_activity(org_id, user_id, "shared_chat_deleted", f"Deleted shared chat '{session.get('title')}' belonging to user {session_owner_id}.", request)
    
    return {"success": True, "message": "Shared chat deleted successfully."}


# Approvals and notifications endpoints

class ApproveRejectPayload(BaseModel):
    rejectedReason: Optional[str] = None

class BulkApprovalPayload(BaseModel):
    userIds: List[str]
    action: str  # "approve" or "reject"
    rejectedReason: Optional[str] = None

@router.get("/approvals/pending")
async def get_pending_approvals(
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    if user_role not in ["Head", "HR"]:
        raise HTTPException(status_code=403, detail="Access denied. Only Head or HR can view approval requests.")

    # Find users belonging to org with status pending
    pending_users = []
    cursor = db.users.find({
        "organizationId": org_id,
        "approvalStatus": "pending"
    })
    async for doc in cursor:
        pending_users.append({
            "userId": doc["user_id"],
            "name": doc.get("fullName") or doc.get("username") or "",
            "email": doc["email"],
            "requestedRole": doc.get("role", "Student"),
            "department": doc.get("department", "General"),
            "joinedAt": doc.get("created_at")
        })
    return {"success": True, "pendingUsers": pending_users}

@router.post("/approvals/{target_user_id}/approve")
async def approve_member(
    target_user_id: str,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    if user_role not in ["Head", "HR"]:
        raise HTTPException(status_code=403, detail="Access denied. Only Head or HR can approve requests.")
        
    target_user = await db.users.find_one({"user_id": target_user_id, "organizationId": org_id})
    if not target_user:
        raise HTTPException(status_code=444, detail="User not found in organization.")
        
    # Check HR constraints
    target_role = target_user.get("role")
    if user_role == "HR":
        if target_role == "Head":
            raise HTTPException(status_code=403, detail="HR role cannot approve the organization Head.")
        if target_role == "HR":
            raise HTTPException(status_code=403, detail="HR role cannot approve another HR member request.")
        
    now = datetime.utcnow().isoformat() + "Z"
    
    # Update user status to active
    await db.users.update_one(
        {"user_id": target_user_id},
        {"$set": {
            "approvalStatus": "active",
            "approvedBy": user_id,
            "approvedAt": now
        }}
    )
    
    # Update organization member status to active
    await db.organization_members.update_one(
        {"organizationId": org_id, "userId": target_user_id},
        {"$set": {"status": "active", "joinedAt": now}}
    )
    
    # Update pending join notifications status
    await db.notifications.update_many(
        {"userId": target_user_id, "organizationId": org_id, "notificationType": "join_request"},
        {"$set": {"status": "approved"}}
    )
    
    # Create notification for approved user
    notif_id = f"NOTIF_{uuid4().hex[:8]}"
    await db.notifications.insert_one({
        "notificationId": notif_id,
        "notificationType": "approval_granted",
        "userId": target_user_id,
        "userName": target_user.get("fullName"),
        "userEmail": target_user.get("email"),
        "organizationId": org_id,
        "organizationName": user.get("organizationName") or org_id,
        "status": "unread",
        "createdAt": now
    })
    
    await log_activity(org_id, user_id, "member_approved", f"Approved user '{target_user.get('fullName')}' to join workspace.", request)
    
    return {"success": True, "message": "User request approved successfully."}

@router.post("/approvals/{target_user_id}/reject")
async def reject_member(
    target_user_id: str,
    payload: ApproveRejectPayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    if user_role not in ["Head", "HR"]:
        raise HTTPException(status_code=403, detail="Access denied. Only Head or HR can reject requests.")
        
    target_user = await db.users.find_one({"user_id": target_user_id, "organizationId": org_id})
    if not target_user:
        raise HTTPException(status_code=444, detail="User not found in organization.")
        
    # Check HR constraints
    target_role = target_user.get("role")
    if user_role == "HR":
        if target_role == "Head":
            raise HTTPException(status_code=403, detail="HR role cannot reject the organization Head.")
        if target_role == "HR":
            raise HTTPException(status_code=403, detail="HR role cannot reject another HR member request.")
        
    now = datetime.utcnow().isoformat() + "Z"
    
    # Update user status to rejected
    await db.users.update_one(
        {"user_id": target_user_id},
        {"$set": {
            "approvalStatus": "rejected",
            "rejectedReason": payload.rejectedReason or "Rejected by administrator."
        }}
    )
    
    # Update organization member status to rejected
    await db.organization_members.update_one(
        {"organizationId": org_id, "userId": target_user_id},
        {"$set": {"status": "rejected"}}
    )
    
    # Update pending join notifications status
    await db.notifications.update_many(
        {"userId": target_user_id, "organizationId": org_id, "notificationType": "join_request"},
        {"$set": {"status": "rejected"}}
    )
    
    # Create notification for rejected user
    notif_id = f"NOTIF_{uuid4().hex[:8]}"
    await db.notifications.insert_one({
        "notificationId": notif_id,
        "notificationType": "request_rejected",
        "userId": target_user_id,
        "userName": target_user.get("fullName"),
        "userEmail": target_user.get("email"),
        "organizationId": org_id,
        "rejectedReason": payload.rejectedReason or "Rejected by administrator.",
        "status": "unread",
        "createdAt": now
    })
    
    await log_activity(org_id, user_id, "member_rejected", f"Rejected user '{target_user.get('fullName')}' join request.", request)
    
    return {"success": True, "message": "User request rejected."}

@router.post("/approvals/bulk-action")
async def bulk_approve_reject(
    payload: BulkApprovalPayload,
    request: Request,
    user_id: str = Depends(get_user_id)
):
    user = await get_user_and_verify_org(user_id)
    org_id = user["organizationId"]
    user_role = user.get("role")
    
    if user_role not in ["Head", "HR"]:
        raise HTTPException(status_code=403, detail="Access denied. Only Head or HR can perform this action.")
        
    now = datetime.utcnow().isoformat() + "Z"
    
    # Verify target users exist in organization
    cursor = db.users.find({"user_id": {"$in": payload.userIds}, "organizationId": org_id})
    targets = await cursor.to_list(length=None)
    target_ids = [t["user_id"] for t in targets]
    
    if not target_ids:
        return {"success": False, "message": "No valid target users selected."}
        
    # Check HR constraints
    if user_role == "HR":
        for t in targets:
            role_to_check = t.get("role") or t.get("requestedRole")
            if role_to_check in ["Head", "HR"]:
                raise HTTPException(status_code=403, detail="HR role cannot approve/reject Head or other HR member requests.")
        
    if payload.action == "approve":
        # Update user statuses
        await db.users.update_many(
            {"user_id": {"$in": target_ids}},
            {"$set": {
                "approvalStatus": "active",
                "approvedBy": user_id,
                "approvedAt": now
            }}
        )
        # Update organization members
        await db.organization_members.update_many(
            {"organizationId": org_id, "userId": {"$in": target_ids}},
            {"$set": {"status": "active", "joinedAt": now}}
        )
        # Update request notifications
        await db.notifications.update_many(
            {"userId": {"$in": target_ids}, "organizationId": org_id, "notificationType": "join_request"},
            {"$set": {"status": "approved"}}
        )
        # Create approval notifications
        notif_docs = []
        for t in targets:
            notif_docs.append({
                "notificationId": f"NOTIF_{uuid4().hex[:8]}",
                "notificationType": "approval_granted",
                "userId": t["user_id"],
                "userName": t.get("fullName"),
                "userEmail": t.get("email"),
                "organizationId": org_id,
                "status": "unread",
                "createdAt": now
            })
        if notif_docs:
            await db.notifications.insert_many(notif_docs)
            
        await log_activity(org_id, user_id, "bulk_member_approved", f"Approved {len(target_ids)} users to join workspace.", request)
        
    elif payload.action == "reject":
        # Update user statuses
        await db.users.update_many(
            {"user_id": {"$in": target_ids}},
            {"$set": {
                "approvalStatus": "rejected",
                "rejectedReason": payload.rejectedReason or "Rejected by administrator."
            }}
        )
        # Update organization members
        await db.organization_members.update_many(
            {"organizationId": org_id, "userId": {"$in": target_ids}},
            {"$set": {"status": "rejected"}}
        )
        # Update request notifications
        await db.notifications.update_many(
            {"userId": {"$in": target_ids}, "organizationId": org_id, "notificationType": "join_request"},
            {"$set": {"status": "rejected"}}
        )
        # Create rejection notifications
        notif_docs = []
        for t in targets:
            notif_docs.append({
                "notificationId": f"NOTIF_{uuid4().hex[:8]}",
                "notificationType": "request_rejected",
                "userId": t["user_id"],
                "userName": t.get("fullName"),
                "userEmail": t.get("email"),
                "organizationId": org_id,
                "rejectedReason": payload.rejectedReason or "Rejected by administrator.",
                "status": "unread",
                "createdAt": now
            })
        if notif_docs:
            await db.notifications.insert_many(notif_docs)
            
        await log_activity(org_id, user_id, "bulk_member_rejected", f"Rejected {len(target_ids)} user join requests.", request)
        
    return {"success": True, "message": "Bulk action completed successfully."}

@router.get("/notifications")
async def get_user_notifications(
    user_id: str = Depends(get_user_id)
):
    # Fetch user details
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    notifications_list = []
    
    # If user is Head/HR, retrieve join requests for their organization
    if user.get("accountType") == "organization" and user.get("role") in ["Head", "HR"]:
        org_id = user["organizationId"]
        cursor = db.notifications.find({
            "organizationId": org_id,
            "notificationType": "join_request"
        }).sort("createdAt", -1).limit(50)
        async for doc in cursor:
            notifications_list.append({
                "notificationId": doc["notificationId"],
                "notificationType": doc["notificationType"],
                "userId": doc["userId"],
                "userName": doc["userName"],
                "userEmail": doc["userEmail"],
                "requestedRole": doc["requestedRole"],
                "department": doc["department"],
                "organizationId": doc["organizationId"],
                "status": doc["status"],
                "createdAt": doc["createdAt"]
            })
            
    # Also retrieve personal notifications matching target userId (e.g. approvals, rejections, role updates)
    cursor = db.notifications.find({
        "userId": user_id,
        "notificationType": {"$ne": "join_request"}
    }).sort("createdAt", -1).limit(50)
    async for doc in cursor:
        notifications_list.append({
            "notificationId": doc["notificationId"],
            "notificationType": doc["notificationType"],
            "userId": doc["userId"],
            "userName": doc.get("userName"),
            "userEmail": doc.get("userEmail"),
            "organizationId": doc.get("organizationId"),
            "rejectedReason": doc.get("rejectedReason"),
            "status": doc["status"],
            "createdAt": doc["createdAt"]
        })
        
    # Deduplicate and sort by createdAt descending
    deduped = []
    seen = set()
    for notif in notifications_list:
        if notif["notificationId"] not in seen:
            seen.add(notif["notificationId"])
            deduped.append(notif)
            
    deduped.sort(key=lambda x: x["createdAt"], reverse=True)
    return {"success": True, "notifications": deduped}

@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    user_id: str = Depends(get_user_id)
):
    await db.notifications.update_many(
        {"notificationId": notification_id},
        {"$set": {"status": "read"}}
    )
    return {"success": True, "message": "Notification marked as read."}
