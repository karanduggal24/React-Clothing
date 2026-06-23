"""
Authentication Dependencies
FastAPI dependencies for protecting routes with JWT authentication
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from .jwt_utils import verify_token

# HTTP Bearer scheme for Authorization header
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Dependency to get current authenticated user from JWT token
    
    Usage:
        @router.get("/protected")
        def protected_route(current_user: dict = Depends(get_current_user)):
            # current_user contains: {"sub": "email", "user_id": 1, "role": "admin"}
            return {"message": f"Hello {current_user['sub']}"}
    
    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    token = credentials.credentials
    print(f"[AUTH DEBUG] Received token: {token[:50]}...")  # Print first 50 chars
    
    payload = verify_token(token)
    print(f"[AUTH DEBUG] Decoded payload: {payload}")
    
    if not payload:
        print("[AUTH DEBUG] Token verification failed - invalid or expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"[AUTH DEBUG] User authenticated: {payload.get('sub')} (role: {payload.get('role')})")
    return payload


def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Dependency to ensure current user is an admin
    
    Usage:
        @router.get("/admin/users")
        def admin_only_route(current_user: dict = Depends(get_current_admin)):
            # Only admins can access this route
            return {"users": [...]}
    
    Raises:
        HTTPException: 403 if user is not an admin
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user


def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Optional[dict]:
    """
    Dependency to get current user if token is provided, None otherwise
    Useful for routes that work with or without authentication
    
    Usage:
        @router.get("/products")
        def get_products(current_user: Optional[dict] = Depends(get_optional_user)):
            if current_user:
                # Show personalized recommendations
                pass
            else:
                # Show generic products
                pass
    """
    if not credentials:
        return None
    
    token = credentials.credentials
    return verify_token(token)
