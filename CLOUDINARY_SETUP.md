# Cloudinary Image Storage Setup Guide

## Why Cloudinary?
Render's free tier uses ephemeral storage - uploaded images are deleted when the server restarts (every ~15 min of inactivity). Cloudinary provides permanent cloud storage for your images.

## Setup Steps

### 1. Create Cloudinary Account (Free)
1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email address
4. You'll get:
   - 25GB storage
   - 25GB bandwidth/month
   - Free forever

### 2. Get Your Credentials
1. After login, go to Dashboard
2. You'll see three values:
   - **Cloud Name**: (e.g., `dxxxxx`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 3. Add to Render Environment Variables
1. Go to https://dashboard.render.com
2. Click on your `react-clothing` backend service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add these three variables:
   ```
   CLOUDINARY_CLOUD_NAME = your_cloud_name_here
   CLOUDINARY_API_KEY = your_api_key_here
   CLOUDINARY_API_SECRET = your_api_secret_here
   ```
6. Click **Save Changes**
7. Render will automatically redeploy

### 4. Test Image Upload
1. Wait for Render to finish deploying (~2-3 minutes)
2. Go to your deployed site
3. Login as admin
4. Try adding a product with an image
5. The image should now be stored on Cloudinary permanently!

## How It Works

### Backend (Already Configured)
- `BackEnd/requirements.txt` includes `cloudinary==1.36.0`
- `BackEnd/config/cloudinary_config.py` handles Cloudinary connection
- `BackEnd/routers/Products.py` upload endpoint:
  - Tries Cloudinary first (if credentials are set)
  - Falls back to local storage if Cloudinary fails
  - Returns the image URL

### Image URLs
- **Cloudinary**: `https://res.cloudinary.com/your-cloud/image/upload/v123/clothing-store/products/image.jpg`
- **Local fallback**: `/uploads/products/image.jpg` (temporary, deleted on restart)

## Verify It's Working

### Check Cloudinary Dashboard
1. Go to https://cloudinary.com/console/media_library
2. Navigate to `clothing-store/products` folder
3. You should see your uploaded images

### Check Backend Logs
1. Go to Render dashboard → Your service → Logs
2. Look for: `"Image uploaded successfully to Cloudinary"`
3. If you see: `"Cloudinary upload failed"` - check your credentials

## Troubleshooting

### Images still disappearing?
- Check Render environment variables are set correctly
- Verify Cloudinary credentials in dashboard
- Check Render logs for errors

### Upload fails?
- Check file size (Cloudinary free tier: max 10MB per image)
- Verify file type is allowed (.jpg, .jpeg, .png, .gif, .webp)
- Check Cloudinary dashboard for quota usage

### Old images not showing?
- Old images uploaded before Cloudinary setup are lost
- Re-upload products with new images
- New images will be permanent

## Cost
- **Free tier**: 25GB storage, 25GB bandwidth/month
- Perfect for small to medium e-commerce sites
- Upgrade only if you exceed limits

## Benefits
✅ Images persist across deployments
✅ Fast CDN delivery worldwide
✅ Automatic image optimization
✅ No server storage needed
✅ Easy to manage in dashboard
