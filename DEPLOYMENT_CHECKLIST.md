# Deployment Checklist ✅

## Backend (Render)
- [x] Code pushed to GitHub
- [x] Render service created
- [x] Python 3.11 runtime specified
- [x] Root directory: `BackEnd`
- [x] Build command: `pip install -r requirements.txt`
- [x] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Environment Variables (Render)
Add these in Render Dashboard → Environment:
```
DATABASE_URL = mysql+pymysql://sql12808483:l9j2iUlh9i@sql12.freesqldatabase.com:3306/sql12808483
DB_USER = sql12808483
DB_PASSWORD = l9j2iUlh9i
DB_HOST = sql12.freesqldatabase.com
DB_PORT = 3306
DB_NAME = sql12808483
CORS_ORIGINS = https://react-clothing.vercel.app,http://localhost:5173,http://localhost:5174
SECRET_KEY = (auto-generated or custom)
JWT_SECRET_KEY = (auto-generated or custom)

# For image uploads (REQUIRED for production)
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

## Frontend (Vercel)
- [x] Code pushed to GitHub
- [x] Vercel project created
- [x] Auto-deploy enabled

### Environment Variables (Vercel)
Add these in Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL = https://react-clothing.onrender.com
VITE_UPLOAD_URL = https://react-clothing.onrender.com/uploads
```

## Database (FreeSQLDatabase)
- [x] Database created
- [x] Tables created (products, cart, orders, users)
- [x] Connection tested

## Image Storage (Cloudinary)
- [ ] Account created at cloudinary.com
- [ ] Credentials added to Render environment variables
- [ ] Test upload performed

## URLs
- **Frontend**: https://react-clothing.vercel.app
- **Backend**: https://react-clothing.onrender.com
- **Database**: sql12.freesqldatabase.com

## Known Limitations (Free Tier)
1. **Render**: Server sleeps after 15 min inactivity (30-60s cold start)
2. **Database**: 5MB storage limit on FreeSQLDatabase
3. **Images**: Must use Cloudinary for persistence

## Testing Checklist
- [ ] Frontend loads
- [ ] Products display
- [ ] User signup/login works
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Admin dashboard accessible
- [ ] Image upload works (Cloudinary)
- [ ] Orders save to database
- [ ] Charts update with new data

## Troubleshooting
- **500 errors**: Check Render logs
- **CORS errors**: Verify CORS_ORIGINS in Render
- **Images disappear**: Set up Cloudinary
- **Slow first load**: Normal for free tier (cold start)
