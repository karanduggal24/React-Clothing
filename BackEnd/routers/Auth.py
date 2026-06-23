"""
OAuth Authentication Router
Handles Google OAuth 2.0 login flow
"""
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from config.db import supabase
from config.google_oauth_config import get_google_oauth
from utils.jwt_utils import create_access_token
import os
from datetime import datetime, timezone
import json
from urllib.parse import quote

router = APIRouter()

# Get environment variables
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')


@router.get("/google/login")
async def google_login(request: Request):
    """
    Initiates Google OAuth flow
    Redirects user to Google's consent screen
    """
    try:
        google = get_google_oauth()
        redirect_uri = GOOGLE_REDIRECT_URI
        
        return await google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        print(f"OAuth initiation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OAuth initiation failed: {str(e)}")


@router.get("/google/callback")
async def google_callback(request: Request):
    """
    Google redirects here after user approves/denies
    Exchanges authorization code for access token
    Fetches user info from Google
    Creates/finds user in database
    Redirects to frontend with JWT token
    """
    try:
        # Check if user denied access
        error = request.query_params.get('error')
        if error:
            error_description = request.query_params.get('error_description', 'Access denied')
            print(f"OAuth error: {error} - {error_description}")
            
            # Map error types to user-friendly messages
            error_messages = {
                'access_denied': 'You cancelled the sign-in process. Please try again if you want to sign in.',
                'consent_required': 'Consent is required to sign in with Google.',
                'interaction_required': 'Additional interaction is required to complete sign-in.',
            }
            
            user_message = error_messages.get(error, 'Google sign-in was cancelled or failed.')
            error_redirect = f"{FRONTEND_URL}/login?error=oauth_cancelled&message={quote(user_message)}"
            return RedirectResponse(url=error_redirect)
        
        google = get_google_oauth()
        
        # Exchange authorization code for access token
        token = await google.authorize_access_token(request)
        
        # Get user info from Google
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info from Google")
        
        # Extract user data
        email = user_info.get('email')
        name = user_info.get('name')
        google_id = user_info.get('sub')  # Google's unique user ID
        picture = user_info.get('picture')
        
        print(f"OAuth callback - User: {email}, Google ID: {google_id}")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
        
        # Check if user exists
        existing_user = supabase.table("users").select("*").eq("email", email).execute()
        
        now = datetime.now(timezone.utc).isoformat()
        
        if existing_user.data:
            # User exists - update Google ID if not set
            user = existing_user.data[0]
            
            if not user.get('google_id'):
                supabase.table("users").update({
                    "google_id": google_id,
                    "profile_picture": picture,
                    "updated_at": now
                }).eq("id", user['id']).execute()
                print(f"Updated existing user {user['id']} with Google ID")
            
            user_data = user
        else:
            # Create new user with Google OAuth
            result = supabase.table("users").insert({
                "email": email,
                "name": name,
                "google_id": google_id,
                "profile_picture": picture,
                "password": None,  # No password for OAuth users
                "role": "user",
                "is_active": True,
                "created_at": now,
                "updated_at": now
            }).execute()
            
            user_data = result.data[0] if result.data else {}
            print(f"Created new OAuth user: {user_data.get('id')}")
        
        # Generate JWT token with user claims
        token = create_access_token(
            data={
                "sub": user_data.get("email"),
                "user_id": user_data.get("id"),
                "role": user_data.get("role"),
                "name": user_data.get("name"),
                "oauth_provider": "google"
            }
        )
        
        # Prepare user response
        user_response = {
            "id": user_data.get("id"),
            "email": user_data.get("email"),
            "name": user_data.get("name"),
            "phone": user_data.get("phone"),
            "role": user_data.get("role"),
            "profile_picture": user_data.get("profile_picture")
        }
        
        # URL encode the user data
        user_json = json.dumps(user_response)
        user_encoded = quote(user_json)
        
        # Redirect to frontend with JWT token
        frontend_redirect = f"{FRONTEND_URL}/auth/callback?token={token}&user={user_encoded}"
        
        print(f"✅ OAuth successful - Redirecting to: {frontend_redirect}")
        print(f"FRONTEND_URL from env: {FRONTEND_URL}")
        return RedirectResponse(url=frontend_redirect)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"OAuth callback error: {str(e)}")
        # Redirect to frontend with error
        error_message = quote(str(e))
        error_redirect = f"{FRONTEND_URL}/login?error=oauth_failed&message={error_message}"
        return RedirectResponse(url=error_redirect)


@router.get("/google/logout")
async def google_logout():
    """
    Optional: Handle Google OAuth logout
    """
    return {"message": "Logged out successfully"}
