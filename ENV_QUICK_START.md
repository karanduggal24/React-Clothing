# Environment Variables - Quick Start

## ✅ Setup Complete!

Your environment files are configured and ready to use.

## 📁 Files Created

- ✅ `BackEnd/.env` - Backend configuration (with your DB credentials)
- ✅ `BackEnd/.env.example` - Backend template
- ✅ `.env` - Frontend configuration
- ✅ `.env.example` - Frontend template
- ✅ `.gitignore` - Updated to exclude .env files
- ✅ `BackEnd/requirements.txt` - Updated with python-dotenv
- ✅ Backend files updated to use environment variables

## 🚀 Quick Commands

### Start Backend
```bash
cd BackEnd
py -m uvicorn main:app --reload
```

### Start Frontend
```bash
npm run dev
```

## 🔑 Current Configuration

### Backend (BackEnd/.env)
```
Database: mysql://root:karanduggal24@127.0.0.1:3306/clothing_store
API Port: 8000
Upload Dir: public/uploads
CORS: http://localhost:5173, http://localhost:3000
```

### Frontend (.env)
```
API URL: http://127.0.0.1:8000
Upload URL: http://127.0.0.1:8000/uploads
```

## ⚠️ Important Notes

1. **python-dotenv is already installed** ✅
2. **.env files are in .gitignore** - Your credentials are safe ✅
3. **Restart servers** after changing .env files
4. **Frontend variables** must start with `VITE_`

## 🔧 If You Need to Change Settings

### Change Database Password
Edit `BackEnd/.env`:
```env
DB_PASSWORD=your_new_password
```

### Change API Port
Edit `BackEnd/.env`:
```env
API_PORT=8080
```
Then update frontend `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8080
```

### Add Production URL
Edit `BackEnd/.env`:
```env
CORS_ORIGINS=http://localhost:5173,https://yourapp.com
```

## 📖 Full Documentation

See `ENV_SETUP_GUIDE.md` for complete details, security best practices, and troubleshooting.

## ✨ What Changed

Your backend now loads configuration from environment variables instead of hardcoded values:
- Database connection from `BackEnd/.env`
- CORS origins from `BackEnd/.env`
- Upload directory from `BackEnd/.env`

This makes your app more secure and easier to deploy!
