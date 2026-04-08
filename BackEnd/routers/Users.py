from fastapi import APIRouter, HTTPException, status
from config.db import supabase
from Schemas.Users import UserCreate, UserLogin, UserResponse
import hashlib
import secrets
from datetime import datetime, timezone

router = APIRouter()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password


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

        if not verify_password(data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not user.get("is_active", True):
            raise HTTPException(status_code=403, detail="Account is deactivated")

        token = secrets.token_urlsafe(32)

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
async def get_all_users():
    try:
        result = supabase.table("users").select("id, email, name, phone, role, is_active, created_at").execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")


@router.get("/users/{user_id}")
async def get_user(user_id: int):
    try:
        result = supabase.table("users").select("id, email, name, phone, role, is_active, created_at").eq("id", user_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


@router.patch("/users/{user_id}/role")
async def update_user_role(user_id: int, role: str):
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
async def delete_user(user_id: int):
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
