import os
from uuid import uuid4
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from services.file_service import validate_file, extract_text_from_file
from middleware.auth import get_user_id
from database.mongodb import db

router = APIRouter(
    prefix="/api",
    tags=["Uploads"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    user_id: str = Depends(get_user_id)
):
    # Read file size
    contents = await file.read()
    file_size = len(contents)
    # Reset read pointer
    await file.seek(0)

    if not validate_file(file.filename, file_size):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type or size. Limit 10MB, supported: TXT, PDF, DOCX, PNG, JPG, JPEG, WEBP."
        )

    file_id = str(uuid4())
    _, ext = os.path.splitext(file.filename.lower())
    saved_filename = f"{file_id}{ext}"
    
    # Isolate uploads by user ID
    user_upload_dir = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_upload_dir, exist_ok=True)
    file_path = os.path.join(user_upload_dir, saved_filename)

    try:
        # Save file contents
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    extracted_text = await extract_text_from_file(file_path)

    # Note: frontend will fetch from /uploads/user_id/filename
    request_base = str(request.base_url).rstrip("/")
    file_url = f"{request_base}/uploads/{user_id}/{saved_filename}"

    # Database design requirement: Files collection record containing user_id
    file_document = {
        "user_id": user_id,
        "session_id": "", # Will be filled when saved in message
        "filename": file.filename,
        "path": file_path
    }
    await db.files.insert_one(file_document)

    return {
        "success": True,
        "file_id": file_id,
        "filename": file.filename,
        "file_type": ext.replace(".", ""),
        "file_url": file_url,
        "extracted_text": extracted_text,
        "saved_filename": saved_filename
    }
