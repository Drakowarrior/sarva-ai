import os
import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.health_routes import router as health_router
from routes.session_routes import router as session_router
from routes.chat_routes import router as chat_router
from routes.message_routes import router as message_router
from routes.file_routes import router as file_router
from routes.user_routes import router as user_router
from routes.auth_routes import router as auth_router
from routes.feedback_routes import router as feedback_router
from routes.share_routes import router as share_router
from routes.org_routes import router as org_router


app = FastAPI(
    title="SARVA AI API",
    version="1.0.0"
)

from fastapi.responses import JSONResponse

# Basic Rate Limiting Middleware (IP based bucket)
rate_limit_records = {}
RATE_LIMIT_CALLS = 200  # 200 requests
RATE_LIMIT_WINDOW = 60  # per 60 seconds

@app.middleware("http")
async def rate_limiter(request: Request, call_next):
    # Exclude OPTIONS requests, health checks, and uploads from rate limiting
    if request.method == "OPTIONS" or request.url.path.endswith("/health") or request.url.path.startswith("/uploads"):
        return await call_next(request)
        
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Initialize or clean old requests
    if client_ip not in rate_limit_records:
        rate_limit_records[client_ip] = []
        
    # Keep only timestamps within window
    rate_limit_records[client_ip] = [
        ts for ts in rate_limit_records[client_ip] if now - ts < RATE_LIMIT_WINDOW
    ]
    
    if len(rate_limit_records[client_ip]) >= RATE_LIMIT_CALLS:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please slow down."}
        )
        
    rate_limit_records[client_ip].append(now)
    response = await call_next(request)
    return response

# CORS configuration loading origins dynamically
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
origins = list(set([o for o in origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if not present
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files for file uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(session_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(file_router)
app.include_router(user_router)
app.include_router(feedback_router)
app.include_router(share_router)
app.include_router(org_router)


@app.on_event("startup")
async def startup_event():
    from database.db_init import init_db_indexes
    await init_db_indexes()


@app.get("/")
async def root():
    return {
        "message": "SARVA AI Backend Running 🚀",
        "features": ["Chat", "Sessions", "File Analysis", "Static Uploads", "User Statistics"]
    }

