import time
import re
from typing import Dict, List
from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel
import asyncio
from services.groq_service import async_client

router = APIRouter(prefix="/api/demo", tags=["Public Demo"])

# In-memory rate limiting for demo endpoint
# IP -> timestamps
IP_DEMO_RECORDS: Dict[str, List[float]] = {}
# SessionID -> message count
SESSION_DEMO_COUNTS: Dict[str, int] = {}

IP_WINDOW_SECONDS = 3600  # 1 hour
MAX_DEMO_PER_IP = 5
MAX_DEMO_PER_SESSION = 3
MAX_PROMPT_LENGTH = 500
MAX_RESPONSE_TOKENS = 200

class DemoChatRequest(BaseModel):
    session_id: str
    prompt: str

@router.post("/chat")
async def demo_chat(req: DemoChatRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # 1. Clean IP records
    if client_ip not in IP_DEMO_RECORDS:
        IP_DEMO_RECORDS[client_ip] = []
    IP_DEMO_RECORDS[client_ip] = [
        ts for ts in IP_DEMO_RECORDS[client_ip] if now - ts < IP_WINDOW_SECONDS
    ]
    
    # 2. Check IP Rate Limit
    if len(IP_DEMO_RECORDS[client_ip]) >= MAX_DEMO_PER_IP:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Public demo limit reached for your IP address (5 per hour). Create a free SARVA AI account for unlimited chats!"
        )
        
    # 3. Check Session Rate Limit
    session_id = req.session_id.strip() if req.session_id else "anon"
    current_session_count = SESSION_DEMO_COUNTS.get(session_id, 0)
    if current_session_count >= MAX_DEMO_PER_SESSION:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You've used all 3 demo messages for this session. Create your free SARVA AI account to continue unlimited conversations!"
        )
        
    # 4. Prompt validation & sanitization
    raw_prompt = req.prompt.strip()
    if not raw_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    if len(raw_prompt) > MAX_PROMPT_LENGTH:
        raise HTTPException(
            status_code=400, 
            detail=f"Demo prompt exceeds maximum allowed length of {MAX_PROMPT_LENGTH} characters."
        )
        
    # Basic anti-abuse filter
    sanitized_prompt = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw_prompt)

    # 5. Record request timestamp & update session count
    IP_DEMO_RECORDS[client_ip].append(now)
    SESSION_DEMO_COUNTS[session_id] = current_session_count + 1
    remaining_in_session = MAX_DEMO_PER_SESSION - SESSION_DEMO_COUNTS[session_id]

    system_prompt = (
        "You are SARVA AI Demo Assistant. Provide a concise, clear, helpful response in under 120 words. "
        "Format code snippets using clean markdown."
    )

    try:
        # Timeout after 8 seconds
        completion = await asyncio.wait_for(
            async_client.chat.completions.create(
                model="groq/compound-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": sanitized_prompt}
                ],
                temperature=0.7,
                max_tokens=MAX_RESPONSE_TOKENS
            ),
            timeout=8.0
        )
        
        reply_text = completion.choices[0].message.content
        return {
            "is_demo": True,
            "reply": reply_text,
            "demo_count_remaining": remaining_in_session,
            "demo_limit_total": MAX_DEMO_PER_SESSION,
            "message": "Demo mode active. Create a free account for unlimited access & document upload."
        }
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="The demo request timed out. Please try again or create a free account."
        )
    except Exception as e:
        print(f"Public Demo Error: {e}")
        # Fallback response for safety
        return {
            "is_demo": True,
            "reply": f"SARVA AI processed your demo request! Example output for: '{sanitized_prompt[:50]}...'\n\nCreate a free account to unlock high-capacity models and file analysis.",
            "demo_count_remaining": remaining_in_session,
            "demo_limit_total": MAX_DEMO_PER_SESSION,
            "message": "Demo response delivered."
        }
