from fastapi import APIRouter, HTTPException, status
from models.Users import users
from config.db import conn
from Schemas.Users import UserCreate, UserLogin, UserResponse
import hashlib
import secrets

router = APIRouter()

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(data: UserCreate):
    """Register a new user"""
    try:
        # Check if email already exists
        check_query = users.select().where(users.c.email == data.email)
        existing = conn.execute(check_query).fetchone()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = hash_password(data.password)
        
        # Insert user
        result = conn.execute(users.insert().values(
            email=data.email,
            password=hashed_password,
            name=data.name,
            phone=data.phone,
            role="user"  # Default role
        ))

        
        return {
            "message": "User registered successfully",
            "user_id": result.lastrowid,
            "email": data.email,
            "name": data.name,
            "role": "user"
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )


@router.post("/login")
async def login(data: UserLogin):
    """Login user"""
    try:
        # Find user by email
        query = users.select().where(users.c.email == data.email)
        user = conn.execute(query).fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Generate simple token (in production, use JWT)
        token = secrets.token_urlsafe(32)
        
        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "phone": user.phone,
                "role": user.role
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during login: {str(e)}"
        )


@router.get("/users")
async def get_all_users():
    """Get all users (admin only in production)"""
    try:
        query = users.select()
        result = conn.execute(query).fetchall()
        
        users_list = []
        for row in result:
            users_list.append({
                "id": row.id,
                "email": row.email,
                "name": row.name,
                "phone": row.phone,
                "role": row.role,
                "is_active": row.is_active,
                "created_at": row.created_at.isoformat() if row.created_at else None
            })
        
        return users_list
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching users: {str(e)}"
        )


@router.get("/users/{user_id}")
async def get_user(user_id: int):
    """Get user by ID"""
    try:
        query = users.select().where(users.c.id == user_id)
        user = conn.execute(query).fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user: {str(e)}"
        )


@router.patch("/users/{user_id}/role")
async def update_user_role(user_id: int, role: str):
    """Update user role (admin only)"""
    try:
        if role not in ["admin", "user"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role must be either 'admin' or 'user'"
            )
        
        # Check if user exists
        check_query = users.select().where(users.c.id == user_id)
        existing_user = conn.execute(check_query).fetchone()
        
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        # Update role
        update_query = users.update().where(users.c.id == user_id).values(role=role)
        conn.execute(update_query)

        
        return {
            "message": "User role updated successfully",
            "user_id": user_id,
            "new_role": role
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating user role: {str(e)}"
        )


@router.delete("/users/{user_id}")
async def delete_user(user_id: int):
    """Delete user (admin only)"""
    try:
        # Check if user exists
        check_query = users.select().where(users.c.id == user_id)
        existing_user = conn.execute(check_query).fetchone()
        
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        # Delete user
        delete_query = users.delete().where(users.c.id == user_id)
        conn.execute(delete_query)

        
        return {
            "message": "User deleted successfully",
            "user_id": user_id,
            "deleted_user": {
                "email": existing_user.email,
                "name": existing_user.name
            }
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting user: {str(e)}"
        )
