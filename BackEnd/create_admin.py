"""
Script to create an admin user for testing
Run this script to create an admin account: admin@example.com / admin123
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.db import supabase
from passlib.context import CryptContext
from datetime import datetime, timezone

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password using bcrypt with automatic salting"""
    return pwd_context.hash(password)

def create_admin():
    try:
        # Check if admin already exists
        existing = supabase.table("users").select("*").eq("email", "admin@example.com").execute()
        
        if existing.data:
            print("❌ Admin user already exists!")
            print(f"   Email: admin@example.com")
            print(f"   Role: {existing.data[0]['role']}")
            print(f"   User ID: {existing.data[0]['id']}")
            return
        
        # Create admin user with bcrypt hashed password
        hashed_password = hash_password("admin123")
        now = datetime.now(timezone.utc).isoformat()
        
        result = supabase.table("users").insert({
            "email": "admin@example.com",
            "password": hashed_password,
            "name": "Admin User",
            "phone": "1234567890",
            "role": "admin",
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }).execute()
        
        inserted = result.data[0] if result.data else {}
        
        print("✅ Admin user created successfully!")
        print(f"   Email: admin@example.com")
        print(f"   Password: admin123")
        print(f"   User ID: {inserted.get('id')}")
        print(f"   Password Hash: {hashed_password[:20]}... (bcrypt)")
        print("\n🔐 You can now login with these credentials")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")

if __name__ == "__main__":
    create_admin()
