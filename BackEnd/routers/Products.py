from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from fastapi.responses import FileResponse
from typing import Optional
from config.db import supabase
from Schemas.Products import Product
from utils.cache import cache
import os
import shutil
from pathlib import Path
import uuid

router = APIRouter()

UPLOAD_DIR = Path("public/uploads/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/")
def get_products(
    category: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    in_stock: Optional[bool] = Query(None),
    page: int = Query(1, ge=1, description="Page number starting from 1"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page")
):
    try:
        cache_key = f"products_{category}_{min_price}_{max_price}_{search}_{in_stock}_{page}_{page_size}"
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

        # Build base query with count
        count_query = supabase.table("products").select("*", count="exact")
        data_query = supabase.table("products").select("*")

        # Apply filters to both queries
        for query in [count_query, data_query]:
            if category:
                query = query.eq("Category", category)
            if min_price is not None:
                query = query.gte("Price", min_price)
            if max_price is not None:
                query = query.lte("Price", max_price)
            if search:
                query = query.ilike("name", f"%{search}%")
            if in_stock is True:
                query = query.gt("Quantity", 0)
            elif in_stock is False:
                query = query.eq("Quantity", 0)

        # Get total count
        count_result = count_query.execute()
        total_count = count_result.count if hasattr(count_result, 'count') else len(count_result.data or [])

        # Apply pagination
        offset = (page - 1) * page_size
        data_query = data_query.range(offset, offset + page_size - 1).order("id", desc=False)
        
        result = data_query.execute()
        products_list = result.data or []

        # Calculate pagination metadata
        total_pages = (total_count + page_size - 1) // page_size
        
        response = {
            "products": products_list,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": total_count,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        }

        cache.set(cache_key, response, ttl_seconds=300)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")


@router.get("/{product_id}")
def get_product_by_id(product_id: int):
    try:
        result = supabase.table("products").select("*").eq("id", product_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")


@router.post("/")
async def create_product(data: Product):
    try:
        result = supabase.table("products").insert({
            "name": data.name,
            "Category": data.Category,
            "Price": data.Price,
            "Description": data.Description,
            "Image": data.Image,
            "Quantity": data.Quantity
        }).execute()

        cache.clear()
        inserted = result.data[0] if result.data else {}
        return {
            "message": "Product created successfully",
            "product_id": inserted.get("id"),
            "product": inserted
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")


@router.put("/{product_id}")
async def update_product(product_id: int, data: Product):
    try:
        existing = supabase.table("products").select("id").eq("id", product_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

        result = supabase.table("products").update({
            "name": data.name,
            "Category": data.Category,
            "Price": data.Price,
            "Description": data.Description,
            "Image": data.Image,
            "Quantity": data.Quantity
        }).eq("id", product_id).execute()

        cache.clear()
        return {"message": "Product updated successfully", "product": result.data[0] if result.data else None}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")


@router.delete("/{product_id}")
async def delete_product(product_id: int):
    try:
        existing = supabase.table("products").select("id").eq("id", product_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

        supabase.table("products").delete().eq("id", product_id).execute()
        cache.clear()
        return {"message": "Product deleted successfully", "product_id": product_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")


@router.patch("/{product_id}/reduce-stock")
async def reduce_product_stock(product_id: int, quantity: int = Query(...)):
    try:
        result = supabase.table("products").select("id, Quantity").eq("id", product_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

        current_qty = result.data["Quantity"]
        if current_qty < quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Available: {current_qty}, Requested: {quantity}")

        new_quantity = current_qty - quantity
        supabase.table("products").update({"Quantity": new_quantity}).eq("id", product_id).execute()
        cache.clear()

        return {
            "message": "Stock reduced successfully",
            "product_id": product_id,
            "previous_quantity": current_qty,
            "reduced_by": quantity,
            "new_quantity": new_quantity
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reducing stock: {str(e)}")


@router.post("/upload-image")
async def upload_product_image(file: UploadFile = File(...)):
    try:
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
        file_extension = Path(file.filename).suffix.lower()

        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}")

        try:
            from config.cloudinary_config import upload_image
            file_content = await file.read()
            image_url = upload_image(file_content, folder="clothing-store/products")
            return {"message": "Image uploaded to Cloudinary", "path": image_url, "url": image_url}
        except Exception as cloudinary_error:
            print(f"Cloudinary upload failed: {cloudinary_error}, falling back to local storage")
            await file.seek(0)
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = UPLOAD_DIR / unique_filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            relative_path = f"/uploads/products/{unique_filename}"
            return {"message": "Image uploaded locally", "path": relative_path, "url": relative_path}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")


@router.get("/image/{filename}")
async def get_product_image(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)
