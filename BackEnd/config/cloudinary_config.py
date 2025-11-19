import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_image(file, folder="products"):
    """Upload image to Cloudinary"""
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image"
        )
        return result['secure_url']
    except Exception as e:
        raise Exception(f"Failed to upload image: {str(e)}")

def delete_image(public_id):
    """Delete image from Cloudinary"""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        raise Exception(f"Failed to delete image: {str(e)}")
