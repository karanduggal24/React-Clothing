from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import Optional
from models.Products import products
from config.db import conn
from Schemas.Products import Product
import os
import shutil
from pathlib import Path
import uuid

router = APIRouter()

# Define upload directory
UPLOAD_DIR = Path("public/uploads/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/")
def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[int] = Query(None, description="Minimum price"),
    max_price: Optional[int] = Query(None, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in product name"),
    in_stock: Optional[bool] = Query(None, description="Filter products in stock")
):
    """
    Get all products with optional filters:
    - category: Filter by category name
    - min_price: Minimum price filter
    - max_price: Maximum price filter
    - search: Search in product name
    - in_stock: Show only products in stock (Quantity > 0)
    """
    try:
        # Start with base query
        query = products.select()
        
        # Apply filters
        conditions = []
        
        if category:
            conditions.append(products.c.Category == category)
        
        if min_price is not None:
            conditions.append(products.c.Price >= min_price)
        
        if max_price is not None:
            conditions.append(products.c.Price <= max_price)
        
        if search:
            conditions.append(products.c.name.like(f"%{search}%"))
        
        if in_stock is not None:
            if in_stock:
                conditions.append(products.c.Quantity > 0)
            else:
                conditions.append(products.c.Quantity == 0)
        
        # Apply all conditions
        if conditions:
            from sqlalchemy import and_
            query = query.where(and_(*conditions))
        
        result = conn.execute(query).fetchall()
        
        # Convert Row objects to dictionaries
        products_list = []
        for row in result:
            products_list.append({
                "id": row.id,
                "name": row.name,
                "Category": row.Category,
                "Price": row.Price,
                "Description": row.Description,
                "Image": row.Image,
                "Quantity": row.Quantity
            })
        return products_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")


@router.get("/{product_id}")
def get_product_by_id(product_id: int):
    """Get a single product by ID"""
    try:
        query = products.select().where(products.c.id == product_id)
        result = conn.execute(query).fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
        
        return {
            "id": result.id,
            "name": result.name,
            "Category": result.Category,
            "Price": result.Price,
            "Description": result.Description,
            "Image": result.Image,
            "Quantity": result.Quantity
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")


@router.post("/")
async def create_product(data: Product):
    """Create a new product"""
    try:
        result = conn.execute(products.insert().values(
            name=data.name,
            Category=data.Category,
            Price=data.Price,
            Description=data.Description,
            Image=data.Image,
            Quantity=data.Quantity
        ))

        
        return {
            "message": "Product created successfully",
            "product_id": result.lastrowid,
            "product": data.dict()
        }
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")


@router.put("/{product_id}")
async def update_product(product_id: int, data: Product):
    """Update an existing product"""
    try:
        # Check if product exists
        check_query = products.select().where(products.c.id == product_id)
        existing = conn.execute(check_query).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
        
        # Update product
        update_query = products.update().where(products.c.id == product_id).values(
            name=data.name,
            Category=data.Category,
            Price=data.Price,
            Description=data.Description,
            Image=data.Image,
            Quantity=data.Quantity
        )
        conn.execute(update_query)

        
        return {
            "message": "Product updated successfully",
            "product_id": product_id,
            "product": data.dict()
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")


@router.delete("/{product_id}")
async def delete_product(product_id: int):
    """Delete a product"""
    try:
        # Check if product exists
        check_query = products.select().where(products.c.id == product_id)
        existing = conn.execute(check_query).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
        
        # Delete product
        delete_query = products.delete().where(products.c.id == product_id)
        conn.execute(delete_query)

        
        return {
            "message": "Product deleted successfully",
            "product_id": product_id
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")


@router.patch("/{product_id}/reduce-stock")
async def reduce_product_stock(product_id: int, quantity: int = Query(..., description="Quantity to reduce")):
    """Reduce product stock quantity (for order processing)"""
    try:
        # Check if product exists
        check_query = products.select().where(products.c.id == product_id)
        existing = conn.execute(check_query).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
        
        # Check if enough stock available
        if existing.Quantity < quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock. Available: {existing.Quantity}, Requested: {quantity}"
            )
        
        # Reduce stock
        new_quantity = existing.Quantity - quantity
        update_query = products.update().where(products.c.id == product_id).values(
            Quantity=new_quantity
        )
        conn.execute(update_query)

        
        return {
            "message": "Stock reduced successfully",
            "product_id": product_id,
            "previous_quantity": existing.Quantity,
            "reduced_by": quantity,
            "new_quantity": new_quantity
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error reducing stock: {str(e)}")


@router.post("/upload-image")
async def upload_product_image(file: UploadFile = File(...)):
    """
    Upload a product image to Cloudinary and return the URL
    """
    try:
        # Validate file type
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Try Cloudinary first (for production)
        try:
            from config.cloudinary_config import upload_image
            
            # Read file content
            file_content = await file.read()
            
            # Upload to Cloudinary
            image_url = upload_image(file_content, folder="clothing-store/products")
            
            return {
                "message": "Image uploaded successfully to Cloudinary",
                "filename": file.filename,
                "path": image_url,
                "url": image_url
            }
        except Exception as cloudinary_error:
            # Fallback to local storage if Cloudinary fails
            print(f"Cloudinary upload failed: {cloudinary_error}, falling back to local storage")
            
            # Reset file pointer
            await file.seek(0)
            
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = UPLOAD_DIR / unique_filename
            
            # Save file locally
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Return relative path for frontend
            relative_path = f"/uploads/products/{unique_filename}"
            
            return {
                "message": "Image uploaded successfully (local storage)",
                "filename": unique_filename,
                "path": relative_path,
                "url": relative_path
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading image: {str(e)}"
        )


@router.get("/image/{filename}")
async def get_product_image(filename: str):
    """
    Serve a product image
    """
    try:
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")
        
        return FileResponse(file_path)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving image: {str(e)}"
        )


@router.delete("/image/{filename}")
async def delete_product_image(filename: str):
    """
    Delete a product image
    """
    try:
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")
        
        os.remove(file_path)
        
        return {
            "message": "Image deleted successfully",
            "filename": filename
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting image: {str(e)}"
        )
