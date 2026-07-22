import re
from database.mongodb import db
from datetime import datetime

def clean_markdown_for_preview(text: str) -> str:
    # Remove markdown headers (e.g. ### Hello -> Hello)
    text = re.sub(r"^#+\s+", "", text, flags=re.MULTILINE)
    # Remove bold, italic, strikethrough, backticks (e.g. **bold** -> bold)
    text = re.sub(r"[*_~`]", "", text)
    # Remove markdown links (e.g. [text](url) -> text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Remove lists and blockquotes formatting (e.g. - item -> item, > quote -> quote)
    text = re.sub(r"^[-*+>]\s+", "", text, flags=re.MULTILINE)
    return text.strip()


def map_to_standard_payload(msg: dict, type_val: str = "chat", request_id: str = "") -> dict:
    msg_id = str(msg.get("_id") or msg.get("messageId") or msg.get("message_id") or "")
    req_id = request_id or msg.get("request_id") or ""
    content = msg.get("message") or msg.get("content") or ""
    return {
        "requestId": req_id,
        "sessionId": msg.get("session_id") or "",
        "userId": msg.get("user_id") or "",
        "messageId": msg_id,
        "_id": msg_id,  # legacy compatibility
        "role": msg.get("role") or "",
        "timestamp": msg.get("timestamp") or "",
        "messageIndex": msg.get("messageIndex") or 0,
        "content": content,
        "message": content,  # legacy compatibility
        "type": type_val,
        "files": msg.get("files") or [],
        "feedback": msg.get("feedback") or None
    }


async def save_message(
    user_id,
    session_id,
    role,
    message,
    files=None,
    request_id="",
    message_id=None
):
    # Check if this message has already been saved to avoid duplicate writes
    if message_id or request_id:
        query = {"session_id": session_id, "role": role}
        conditions = []
        if message_id:
            conditions.append({"message_id": message_id})
        if request_id:
            conditions.append({"request_id": request_id})
        query["$or"] = conditions
        
        existing = await db.messages.find_one(query)
        if existing:
            print(f"[DB] Found existing message for role={role}, message_id={message_id}, request_id={request_id}. Skipping insert.")
            return map_to_standard_payload(existing, request_id=request_id)

    now = datetime.utcnow().isoformat() + "Z"
    
    # Calculate messageIndex dynamically
    message_count = await db.messages.count_documents({
        "user_id": user_id,
        "session_id": session_id
    })

    document = {
        "user_id": user_id,
        "session_id": session_id,
        "role": role,
        "message": message,
        "files": files or [],
        "timestamp": now,
        "messageIndex": message_count,
        "request_id": request_id,
        "message_id": message_id
    }

    await db.messages.insert_one(
        document
    )

    # Link uploaded files to this session in MongoDB Files collection
    if files:
        for file_info in files:
            saved_name = file_info.get("saved_filename")
            if saved_name:
                await db.files.update_many(
                    {"user_id": user_id, "path": {"$regex": saved_name}},
                    {"$set": {"session_id": session_id}}
                )

    # Convert MongoDB _id to string for JSON serialization
    if "_id" in document:
        document["_id"] = str(document["_id"])

    # Create last message preview
    preview = message.strip()
    if not preview and files:
        filenames = [f.get("filename", "File") for f in files]
        preview = f"Shared: {', '.join(filenames)}"
    
    if "```" in preview:
        preview_clean = re.sub(r"```[\s\S]*?```", "", preview).strip()
        if not preview_clean:
            code_content = re.sub(r"```\w*\n?", "", preview).strip()
            preview = clean_markdown_for_preview(code_content)
        else:
            preview = clean_markdown_for_preview(preview_clean)
    else:
        preview = clean_markdown_for_preview(preview)
        
    if len(preview) > 60:
        preview = preview[:57] + "..."

    # Auto-save metadata updates to parent session
    await db.sessions.update_one(
        {"user_id": user_id, "session_id": session_id},
        {"$set": {"last_message": preview, "updated_at": now}}
    )

    return map_to_standard_payload(document, request_id=request_id)


async def get_messages(
    user_id,
    session_id
):
    messages = []

    # Enforce isolation: filter by both user_id and session_id
    cursor = db.messages.find(
        {
            "user_id": user_id,
            "session_id": session_id
        }
    ).sort("timestamp", 1)

    async for message in cursor:
        if "files" not in message:
            message["files"] = []
        messages.append(
            map_to_standard_payload(message)
        )

    return messages