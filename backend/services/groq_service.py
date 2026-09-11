import os
import base64
from groq import Groq, AsyncGroq
from dotenv import load_dotenv

load_dotenv()

# Synchronous client — used by the HTTP POST /chat endpoint (title generation, etc.)
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Async client — used by WebSocket streaming and async generate functions
async_client = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY")
)

DEFAULT_SYSTEM_PROMPT = """You are SARVA AI.
You are an intelligent, helpful, friendly, and professional AI assistant.

You assist with:
- Programming & Coding
- Career Guidance
- Resume Review
- Research & Summary
- Education & DSA
- Productivity & Note-taking
- General Knowledge

Always provide structured, clear, and helpful responses. Use markdown formatting and code block syntax highlighting when appropriate."""

from utils.config import settings

def encode_image_to_base64(file_path: str) -> str:
    """Encode a local image file to base64 string."""
    try:
        with open(file_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        print(f"Error encoding image to base64: {e}")
        return ""

async def generate_ai_response(
    messages_history: list,
    model: str = None,
    system_prompt: str = DEFAULT_SYSTEM_PROMPT
) -> str:
    primary_model = settings.GROQ_MODEL or "openai/gpt-oss-20b"
    max_output_tokens = settings.MAX_OUTPUT_TOKENS or 800

    # Model mapping dictionary to resolve request keys to active Groq endpoints
    model_mapping = {
        "meta-llama/llama-4-scout-17b-16e-instruct": primary_model,
        "qwen/qwen3-32b": primary_model,
        "qwen-3.6-27b": primary_model,
        "qwen/qwen3.6-27b": primary_model,
        "gpt-oss-120b": "openai/gpt-oss-120b",
        "openai/gpt-oss-120b": "openai/gpt-oss-120b",
        "openai/gpt-oss-20b": "openai/gpt-oss-20b",
        "llama-3.1-8b-instant": "groq/compound-mini",
        "groq/compound-mini": "groq/compound-mini",
        "groq/compound": "groq/compound",
        "allam-2-7b": "allam-2-7b"
    }

    resolved_model = model_mapping.get(model, primary_model) if model else primary_model

    try:
        has_images = False
        processed_messages = []
        
        # Add system prompt first
        processed_messages.append({
            "role": "system",
            "content": system_prompt
        })

        for msg in messages_history:
            role = msg.get("role")
            content = msg.get("content") or msg.get("message") or ""
            files = msg.get("files", [])
            
            images_in_msg = []
            text_context = ""
            
            if files:
                for file_info in files:
                    file_type = file_info.get("file_type", "").lower()
                    filename = file_info.get("filename", "")
                    
                    if file_type in {"png", "jpg", "jpeg", "webp"}:
                        saved_filename = file_info.get("saved_filename")
                        user_id_sub = ""
                        url_parts = file_info.get("file_url", "").split("/")
                        if len(url_parts) >= 2:
                            user_id_sub = url_parts[-2]
                            saved_filename = url_parts[-1]
                                
                        if saved_filename:
                            file_path = ""
                            if user_id_sub and user_id_sub != "uploads":
                                file_path = os.path.join("uploads", user_id_sub, saved_filename)
                            if not file_path or not os.path.exists(file_path):
                                file_path = os.path.join("uploads", saved_filename)

                            if os.path.exists(file_path):
                                base64_image = encode_image_to_base64(file_path)
                                if base64_image:
                                    mime_type = f"image/{file_type if file_type != 'jpg' else 'jpeg'}"
                                    images_in_msg.append({
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:{mime_type};base64,{base64_image}"
                                        }
                                    })
                                    has_images = True
                    else:
                        # Text document (PDF, DOCX, TXT), prepend its text to content
                        extracted_text = file_info.get("extracted_text", "")
                        if not extracted_text or extracted_text == "[Image File]":
                            saved_filename = file_info.get("saved_filename")
                            user_id_sub = ""
                            url_parts = file_info.get("file_url", "").split("/")
                            if len(url_parts) >= 2:
                                user_id_sub = url_parts[-2]
                                saved_filename = url_parts[-1]
                                    
                            if saved_filename:
                                file_path = ""
                                if user_id_sub and user_id_sub != "uploads":
                                    file_path = os.path.join("uploads", user_id_sub, saved_filename)
                                if not file_path or not os.path.exists(file_path):
                                    file_path = os.path.join("uploads", saved_filename)
                                    
                                if os.path.exists(file_path):
                                    from services.file_service import extract_text_from_file
                                    extracted_text = await extract_text_from_file(file_path)

                        if extracted_text and extracted_text != "[Image File]":
                            text_context += f"\n\n[Content of attached file: {filename}]\n{extracted_text}\n[End of file content]\n"

            if images_in_msg and role == "user":
                message_content = [{"type": "text", "text": text_context + content}]
                message_content.extend(images_in_msg)
                processed_messages.append({
                    "role": role,
                    "content": message_content
                })
            else:
                processed_messages.append({
                    "role": role,
                    "content": text_context + content
                })

        # Switch to compound-mini if images are present or as fallback
        if has_images and resolved_model not in {"openai/gpt-oss-20b", "groq/compound-mini"}:
            resolved_model = "groq/compound-mini"

        # Attempt primary model call with max_tokens cap
        try:
            completion = await async_client.chat.completions.create(
                model=resolved_model,
                messages=processed_messages,
                temperature=0.7,
                max_tokens=max_output_tokens
            )
            return completion.choices[0].message.content
        except Exception as primary_err:
            print(f"[GROQ SERVICE] Primary model '{resolved_model}' call failed: {primary_err}")
            # Safe Fallback to groq/compound-mini if primary model hits rate limit or error
            fallback_model = "groq/compound-mini"
            if resolved_model != fallback_model:
                print(f"[GROQ SERVICE] Attempting fallback model '{fallback_model}'...")
                fallback_completion = await async_client.chat.completions.create(
                    model=fallback_model,
                    messages=processed_messages,
                    temperature=0.7,
                    max_tokens=max_output_tokens
                )
                return fallback_completion.choices[0].message.content
            raise primary_err

    except Exception as e:
        print(f"[GROQ SERVICE ERROR] LLM inference failed: {e}")
        return "I'm receiving high traffic right now. Please try again in a moment."