from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers.Products import router as ProductRouter
from routers.Cart import router as CartRouter
from routers.Orders import router as OrderRouter
from routers.Users import router as UserRouter
from routers.Auth import router as AuthRouter
from pathlib import Path
import os
from dotenv import load_dotenv
import logging
from starlette.middleware.sessions import SessionMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Log startup info
@app.on_event("startup")
async def startup_event():
    logger.info("Application starting up...")
    logger.info(f"SUPABASE configured: {bool(os.getenv('SUPABASE_URL'))}")
    logger.info(f"CORS_ORIGINS: {os.getenv('CORS_ORIGINS', '*')}")
    logger.info(f"FRONTEND_URL: {os.getenv('FRONTEND_URL', 'NOT SET')}")  # Add this line
    logger.info(f"GOOGLE_REDIRECT_URI: {os.getenv('GOOGLE_REDIRECT_URI', 'NOT SET')}")  # Add this line
    logger.info(f"ENVIRONMENT: {os.getenv('ENVIRONMENT', 'development')}")  # Add this line

# Mount static files for uploaded images
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "public/uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Get CORS origins from environment
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")

# Add session middleware (required for OAuth)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "your-secret-key-change-in-production")
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Clothing Store API", 
        "status": "running",
        "endpoints": {
            "products": "/products",
            "cart": "/cart",
            "orders": "/orders",
            "users": "/signup, /login",
            "oauth": "/auth/google/login"
        }
    }

app.include_router(ProductRouter, prefix="/products", tags=["Products"])
app.include_router(CartRouter, prefix="/cart", tags=["Cart"])
app.include_router(OrderRouter, prefix="/orders", tags=["Orders"])
app.include_router(UserRouter, prefix="", tags=["Users"])
app.include_router(AuthRouter, prefix="/auth", tags=["OAuth"])
