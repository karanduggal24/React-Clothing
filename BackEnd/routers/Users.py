from fastapi import APIRouter, HTTPException, status, Depends
from config.db import supabase
from Schemas.Users import UserCreate, UserLogin, UserResponse
from passlib.context import CryptContext
from datetime import datetime, timezone
from utils.jwt_utils import create_access_token
from utils.auth_dependency import get_current_user, get_current_admin

router = APIRouter()

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt with automatic salting"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a bcrypt hash"""
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(data: UserCreate):
    try:
        # Check if email already exists
        existing = supabase.table("users").select("id").eq("email", data.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        now = datetime.now(timezone.utc).isoformat()
        result = supabase.table("users").insert({
            "email": data.email,
            "password": hash_password(data.password),
            "name": data.name,
            "phone": data.phone,
            "role": "user",
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }).execute()

        inserted = result.data[0] if result.data else {}
        return {
            "message": "User registered successfully",
            "user_id": inserted.get("id"),
            "email": data.email,
            "name": data.name,
            "role": "user"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")


@router.post("/login")
async def login(data: UserLogin):
    try:
        result = supabase.table("users").select("*").eq("email", data.email).single().execute()

        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user = result.data

        # Check if OAuth user (no password)
        if user.get("password") is None:
            raise HTTPException(
                status_code=401, 
                detail="This account uses Google Sign-In. Please use 'Sign in with Google' button."
            )

        if not verify_password(data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not user.get("is_active", True):
            raise HTTPException(status_code=403, detail="Account is deactivated")

        # Create JWT token with user claims
        token = create_access_token(
            data={
                "sub": user["email"],  # Subject (user identifier)
                "user_id": user["id"],
                "role": user["role"],
                "name": user["name"]
            }
        )

        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "phone": user.get("phone"),
                "role": user["role"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}")


@router.get("/users")
async def get_all_users(current_user: dict = Depends(get_current_admin)):
    """
    Get all users (Admin only)
    Requires valid JWT token with admin role
    """
    try:
        result = supabase.table("users").select("id, email, name, phone, role, is_active, created_at, google_id, profile_picture, oauth_provider").execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")


@router.get("/users/{user_id}")
async def get_user(user_id: int, current_user: dict = Depends(get_current_user)):
    """
    Get user by ID
    Requires valid JWT token
    """
    try:
        result = supabase.table("users").select("id, email, name, phone, role, is_active, created_at, google_id, profile_picture, oauth_provider").eq("id", user_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


@router.patch("/users/{user_id}/role")
async def update_user_role(user_id: int, role: str, current_user: dict = Depends(get_current_admin)):
    """
    Update user role (Admin only)
    Requires valid JWT token with admin role
    """
    try:
        if role not in ["admin", "user"]:
            raise HTTPException(status_code=400, detail="Role must be 'admin' or 'user'")

        existing = supabase.table("users").select("id").eq("id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")

        supabase.table("users").update({"role": role}).eq("id", user_id).execute()
        return {"message": "User role updated", "user_id": user_id, "new_role": role}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating role: {str(e)}")


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user: dict = Depends(get_current_admin)):
    """
    Delete user (Admin only)
    Requires valid JWT token with admin role
    """
    try:
        existing = supabase.table("users").select("id, email, name").eq("id", user_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")

        supabase.table("users").delete().eq("id", user_id).execute()
        return {
            "message": "User deleted successfully",
            "user_id": user_id,
            "deleted_user": {"email": existing.data["email"], "name": existing.data["name"]}
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")
