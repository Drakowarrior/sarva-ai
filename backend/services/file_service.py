import os
import pypdf
import docx

ALLOWED_EXTENSIONS = {".txt", ".pdf", ".docx", ".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(filename: str, file_size: int) -> bool:
    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        return False
    if file_size > MAX_FILE_SIZE:
        return False
    return True

async def extract_text_from_file(file_path: str) -> str:
    _, ext = os.path.splitext(file_path.lower())
    
    if ext == ".txt":
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception as e:
            return f"[Error reading text file: {str(e)}]"
            
    elif ext == ".pdf":
        try:
            text = ""
            with open(file_path, "rb") as f:
                reader = pypdf.PdfReader(f)
                for page_idx, page in enumerate(reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text += f"--- Page {page_idx + 1} ---\n{page_text}\n"
            return text
        except Exception as e:
            return f"[Error reading PDF file: {str(e)}]"
            
    elif ext == ".docx":
        try:
            doc = docx.Document(file_path)
            text = []
            for para in doc.paragraphs:
                if para.text:
                    text.append(para.text)
            return "\n".join(text)
        except Exception as e:
            return f"[Error reading DOCX file: {str(e)}]"
            
    elif ext in {".png", ".jpg", ".jpeg", ".webp"}:
        # Multimodal vision files will be sent directly to Groq, no local text extraction needed
        return "[Image File]"
        
    return ""
