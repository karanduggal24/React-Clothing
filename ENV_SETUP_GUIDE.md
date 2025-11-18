# Environment Variables Setup Guide

This guide explains how to configure environment variables for both the backend and frontend of the Clothing Store application.

## Backend Environment Variables

### Location
`BackEnd/.env`

### Setup Instructions

1. Copy the example file:
   ```bash
   copy BackEnd\.env.example BackEnd\.env
   ```

2. Update the values in `BackEnd/.env`:

### Database Configuration
```env
DB_USER=root                    # Your MySQL username
DB_PASSWORD=karanduggal24       # Your MySQL password
DB_HOST=127.0.0.1              # Database host
DB_PORT=3306                    # Database port
DB_NAME=clothing_store          # Database name
```

### Security Settings
```env
SECRET_KEY=your-secret-key-change-this-in-production-min-32-chars
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Important:** Change the SECRET_KEY and JWT_SECRET_KEY to random strings (minimum 32 characters) in production.

### CORS Settings
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```
Add your frontend URLs separated by commas.

### File Upload Settings
```env
UPLOAD_DIR=public/uploads       # Directory for uploaded images
MAX_FILE_SIZE=5242880          # Max file size in bytes (5MB)
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
```

### API Configuration
```env
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=True                 # Set to False in production
```

## Frontend Environment Variables

### Location
`.env` (root directory)

### Setup Instructions

1. Copy the example file:
   ```bash
   copy .env.example .env
   ```

2. Update the values in `.env`:

### API Configuration
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```
This should match your backend URL.

### API Endpoints
```env
VITE_API_PRODUCTS=/products
VITE_API_CART=/cart
VITE_API_ORDERS=/orders
VITE_API_AUTH=/auth
```

### Upload URL
```env
VITE_UPLOAD_URL=http://127.0.0.1:8000/uploads
```
This is used to display uploaded product images.

### App Configuration
```env
VITE_APP_NAME=Clothing Store
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

## Installation

### Backend Dependencies

Install Python dependencies including python-dotenv:
```bash
cd BackEnd
pip install -r requirements.txt
```

### Frontend Dependencies

No additional packages needed - Vite automatically loads .env files.

## Usage in Code

### Backend (Python)
```python
import os
from dotenv import load_dotenv

load_dotenv()

db_user = os.getenv("DB_USER")
api_port = os.getenv("API_PORT", "8000")  # with default value
```

### Frontend (React/Vite)
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const uploadUrl = import.meta.env.VITE_UPLOAD_URL;
```

**Note:** In Vite, only variables prefixed with `VITE_` are exposed to the client.

## Security Best Practices

1. **Never commit .env files** - They're already in .gitignore
2. **Use .env.example** - Commit this with placeholder values
3. **Generate strong secrets** - Use at least 32 random characters
4. **Different keys per environment** - Use different secrets for dev/staging/production
5. **Restrict CORS origins** - In production, specify exact frontend URLs
6. **Rotate secrets regularly** - Change keys periodically in production

## Generating Secure Keys

### Python (for SECRET_KEY and JWT_SECRET_KEY)
```python
import secrets
print(secrets.token_urlsafe(32))
```

### PowerShell
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Troubleshooting

### Backend can't connect to database
- Check DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
- Ensure MySQL is running
- Verify user has permissions

### Frontend can't reach API
- Check VITE_API_BASE_URL matches backend URL
- Ensure backend is running
- Check CORS_ORIGINS in backend .env

### Environment variables not loading
- Backend: Ensure python-dotenv is installed
- Frontend: Restart dev server after changing .env
- Check variable names (frontend must start with VITE_)

### Images not displaying
- Check VITE_UPLOAD_URL matches backend upload endpoint
- Verify UPLOAD_DIR exists and has write permissions
- Ensure backend is serving static files correctly

## Production Deployment

### Backend
1. Set `ENVIRONMENT=production`
2. Set `API_RELOAD=False`
3. Use strong, unique SECRET_KEY and JWT_SECRET_KEY
4. Restrict CORS_ORIGINS to your actual frontend domain
5. Use environment variables from your hosting platform

### Frontend
1. Set `VITE_ENVIRONMENT=production`
2. Update VITE_API_BASE_URL to production backend URL
3. Update VITE_UPLOAD_URL to production upload endpoint
4. Build the app: `npm run build`

## Environment Variables Reference

### Backend Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DB_USER | Yes | - | Database username |
| DB_PASSWORD | Yes | - | Database password |
| DB_HOST | Yes | 127.0.0.1 | Database host |
| DB_PORT | Yes | 3306 | Database port |
| DB_NAME | Yes | - | Database name |
| SECRET_KEY | Yes | - | App secret key |
| JWT_SECRET_KEY | Yes | - | JWT signing key |
| JWT_ALGORITHM | No | HS256 | JWT algorithm |
| ACCESS_TOKEN_EXPIRE_MINUTES | No | 30 | Token expiry time |
| CORS_ORIGINS | Yes | * | Allowed origins |
| UPLOAD_DIR | No | public/uploads | Upload directory |
| MAX_FILE_SIZE | No | 5242880 | Max upload size |
| ALLOWED_EXTENSIONS | No | jpg,jpeg,png,gif,webp | Allowed file types |
| API_HOST | No | 0.0.0.0 | API host |
| API_PORT | No | 8000 | API port |
| API_RELOAD | No | True | Auto-reload |
| ENVIRONMENT | No | development | Environment name |

### Frontend Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_BASE_URL | Yes | - | Backend API URL |
| VITE_API_PRODUCTS | No | /products | Products endpoint |
| VITE_API_CART | No | /cart | Cart endpoint |
| VITE_API_ORDERS | No | /orders | Orders endpoint |
| VITE_API_AUTH | No | /auth | Auth endpoint |
| VITE_UPLOAD_URL | Yes | - | Upload files URL |
| VITE_APP_NAME | No | Clothing Store | App name |
| VITE_APP_VERSION | No | 1.0.0 | App version |
| VITE_ENVIRONMENT | No | development | Environment name |
