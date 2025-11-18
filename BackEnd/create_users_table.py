from BackEnd.config.db import engine, meta, conn
from BackEnd.models.Users import users
import hashlib

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

# Create Users table
meta.create_all(engine)

print("✓ Users table created successfully!")
print(f"✓ Table 'Users' created with columns: {[col.name for col in users.columns]}")

# Check if admin user already exists
check_query = users.select().where(users.c.email == 'admin@clothingstore.com')
existing_admin = conn.execute(check_query).fetchone()

if not existing_admin:
    # Create first admin user
    admin_password = hash_password('admin123')  # Change this password!
    
    conn.execute(users.insert().values(
        email='admin@clothingstore.com',
        password=admin_password,
        name='Admin User',
        phone='1234567890',
        role='admin',
        is_active=True
    ))
    conn.commit()
    
    print("\n✓ First admin user created!")
    print("  Email: admin@clothingstore.com")
    print("  Password: admin123")
    print("  Role: admin")
    print("\n⚠️  IMPORTANT: Change the admin password after first login!")
else:
    print("\n✓ Admin user already exists")

print("\nUsers table structure:")
print("- id: Primary key (auto-increment)")
print("- email: Unique email address")
print("- password: Hashed password (SHA-256)")
print("- name: User full name")
print("- phone: Phone number (optional)")
print("- role: User role (admin/user)")
print("- is_active: Account status")
print("- created_at: Registration timestamp")
print("- updated_at: Last update timestamp")
