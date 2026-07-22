import re
import jwt
from uuid import uuid4
from datetime import datetime
import asyncio
import time
from fastapi import APIRouter, Depends, BackgroundTasks

from schemas.message_schema import MessageCreate
from middleware.auth import get_user_id, verify_session_ownership
from database.mongodb import db
from utils.config import settings

from services.groq_service import (
    generate_ai_response,
    client as groq_client
)

from services.message_service import (
    save_message,
    get_messages
)

router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)

# Smart greetings dictionary
GREETINGS_MAP = {
    r"^(hi|hello|hey|good\s*morning|good\s*evening|good\s*afternoon)$": 
        "Hello! 👋 I’m SARVA AI. I can help with programming, projects, resumes, research, interview preparation, learning, and much more. What would you like to work on today?",
    r"^how\s*are\s*you(\s*doing)?$": 
        "I’m doing great and ready to help. 🚀 What can I assist you with today?",
    r"^(who\s*are\s*you|what\s*is\s*your\s*name|who\s*is\s*sarvaai)$": 
        "I’m SARVA AI, your intelligent AI assistant designed to help with coding, learning, research, career guidance, productivity, and general questions.",
    r"^(thank\s*you|thanks)$": 
        "You're welcome! 😊 Feel free to ask anything whenever you need help.",
    r"^(bye|goodbye|see\s*you)$": 
        "Goodbye! 👋 Have a great day and feel free to return anytime."
}

def check_smart_greeting(message: str) -> str:
    """Normalise input message and check if it matches simple greetings."""
    normalized = re.sub(r"[^\w\s]", "", message.strip().lower())
    for pattern, response in GREETINGS_MAP.items():
        if re.match(pattern, normalized):
            return response
    return ""

async def generate_and_save_session_title(user_id: str, session_id: str, first_message: str):
    """Call Groq to generate a short 2-4 word title for the chat."""
    try:
        title_prompt = (
            "Generate a short, professional title for a conversation starting with this message: "
            f"'{first_message}'. Rules: Maximum 4 words, no special characters, no quotes, "
            "do not use 'New Chat' or 'Untitled'. Respond with ONLY the title."
        )
        
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Quick lightweight model
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates clean conversation titles."},
                {"role": "user", "content": title_prompt}
            ],
            temperature=0.3,
            max_tokens=20
        )
        title = completion.choices[0].message.content.strip().replace('"', '').replace("'", "")
        # Clean title to allow only alphanumeric characters and spaces
        title = "".join(c for c in title if c.isalnum() or c.isspace()).strip()
        
        # Enforce maximum 4 words
        words = title.split()
        if len(words) > 4:
            title = " ".join(words[:4])
            
        if title:
            await db.sessions.update_one(
                {"user_id": user_id, "session_id": session_id},
                {"$set": {"title": title}}
            )
    except Exception as e:
        print(f"Background title generation error: {e}")

@router.post("/chat")
async def chat(
    payload: MessageCreate,
    background_tasks: BackgroundTasks
):
    session_id = payload.sessionId
    user_id = payload.userId
    
    if not payload.messages:
        return {"success": False, "error": "No messages in payload"}
        
    user_message = payload.messages[-1].content
    model = payload.model or "meta-llama/llama-4-scout-17b-16e-instruct"
    files = payload.files or []

    # If session doesn't exist, create it
    session = await db.sessions.find_one({"session_id": session_id})
    if not session:
        now = datetime.utcnow().isoformat() + "Z"
        session = {
            "user_id": user_id,
            "session_id": session_id,
            "title": "New Chat",
            "pinned": False,
            "favorite": False,
            "last_message": "",
            "created_at": now,
            "updated_at": now
        }
        await db.sessions.insert_one(session)
        # Register user record if not present
        await db.users.update_one(
            {"user_id": user_id},
            {
                "$setOnInsert": {
                    "user_id": user_id,
                    "username": f"User_{user_id[-8:]}" if len(user_id) > 8 else f"User_{user_id}",
                    "created_at": now
                }
            },
            upsert=True
        )
    else:
        # Validate session ownership if it does exist
        error_response = await verify_session_ownership(session_id, user_id)
        if error_response:
            return error_response

    # Check session message count before inserting to know if it's the first message
    message_count = await db.messages.count_documents({"user_id": user_id, "session_id": session_id})
    is_first_message = (message_count == 0)

    # Check if user message is simple greeting
    greeting_response = check_smart_greeting(user_message)
    if greeting_response:
        # Save user message
        await save_message(user_id, session_id, "user", user_message, files)
        # Save greeting response
        assistant_msg = await save_message(user_id, session_id, "assistant", greeting_response)
        
        # Generate title synchronously if it's the first message
        generated_title = None
        if is_first_message:
            generated_title = await generate_and_save_session_title(
                user_id,
                session_id,
                user_message
            )
            
        return {
            "success": True,
            "session_id": session_id,
            "response": greeting_response,
            "message": assistant_msg,
            "title": generated_title
        }

    # 2. Regular AI Flow
    # Save the new user message
    await save_message(
        user_id,
        session_id,
        "user",
        user_message,
        files,
        message_id=payload.messageId,
        request_id=payload.requestId
    )

    # Construct history from the payload
    memory_history = []
    for i, msg in enumerate(payload.messages):
        msg_files = []
        if i == len(payload.messages) - 1:
            msg_files = files
        memory_history.append({
            "role": msg.role,
            "content": msg.content,
            "files": msg_files
        })
        
    # Cap conversation memory context to the last 20 messages
    memory_history = memory_history[-20:]

    # Generate response from Groq using capped history
    ai_response = await generate_ai_response(
        messages_history=memory_history,
        model=model
    )

    # Save the assistant response
    assistant_msg = await save_message(
        user_id,
        session_id,
        "assistant",
        ai_response,
        message_id=f"assistant_msg_{uuid4().hex[:12]}",
        request_id=payload.requestId
    )

    # 3. AI Generated Chat Title
    # Generate title synchronously if it's the first conversation turn
    generated_title = None
    if is_first_message:
        generated_title = await generate_and_save_session_title(
            user_id,
            session_id,
            user_message
        )

    return {
        "success": True,
        "session_id": session_id,
        "response": ai_response,
        "message": assistant_msg,
        "title": generated_title
    }

