"""
Script to create an admin user for testing
Run this script to create an admin account: admin@example.com / admin123
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from BackEnd.models.Users import users
from BackEnd.config.db import conn
import hashlib

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_admin():
    try:
        # Check if admin already exists
        check_query = users.select().where(users.c.email == "admin@example.com")
        existing = conn.execute(check_query).fetchone()
        
        if existing:
            print("❌ Admin user already exists!")
            print(f"   Email: admin@example.com")
            print(f"   Role: {existing.role}")
            return
        
        # Create admin user
        hashed_password = hash_password("admin123")
        
        result = conn.execute(users.insert().values(
            email="admin@example.com",
            password=hashed_password,
            name="Admin User",
            phone="1234567890",
            role="admin",
            is_active=True
        ))
        conn.commit()
        
        print("✅ Admin user created successfully!")
        print(f"   Email: admin@example.com")
        print(f"   Password: admin123")
        print(f"   User ID: {result.lastrowid}")
        print("\n🔐 You can now login with these credentials")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error creating admin user: {str(e)}")

if __name__ == "__main__":
    create_admin()
