from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from config.db import supabase
from Schemas.Cart import CartItem, CartItemUpdate
from datetime import datetime, timezone
from utils.auth_dependency import get_current_user

router = APIRouter()


@router.get("/")
def get_cart_items(
    user_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Get user's email from JWT token (stored as 'sub')
        user_email = current_user.get("sub")
        
        # Users can only access their own cart
        if user_id and str(user_id) != str(user_email):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # If no user_id provided, use current user's email
        target_user_id = user_id or user_email
        
        query = supabase.table("cart").select("*").eq("user_id", target_user_id)
        result = query.execute()
        return result.data or []
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cart: {str(e)}")


@router.get("/{cart_item_id}")
def get_cart_item(cart_item_id: int, current_user: dict = Depends(get_current_user)):
    try:
        result = supabase.table("cart").select("*").eq("id", cart_item_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"Cart item {cart_item_id} not found")
        
        # Get user's email from JWT token
        user_email = current_user.get("sub")
        
        # Verify the cart item belongs to the current user
        if str(result.data["user_id"]) != str(user_email):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cart item: {str(e)}")


@router.post("/")
async def add_to_cart(data: CartItem, current_user: dict = Depends(get_current_user)):
    try:
        # Get user's email from JWT token
        user_email = current_user.get("sub")
        
        # Verify user is adding to their own cart
        if str(data.user_id) != str(user_email):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check if item already exists for this user
        existing = supabase.table("cart").select("*") \
            .eq("user_id", data.user_id) \
            .eq("product_id", data.product_id) \
            .execute()

        now = datetime.now(timezone.utc).isoformat()

        if existing.data:
            item = existing.data[0]
            new_quantity = item["quantity"] + data.quantity
            supabase.table("cart").update({
                "quantity": new_quantity,
                "updated_at": now
            }).eq("id", item["id"]).execute()

            return {
                "message": "Cart item quantity updated",
                "cart_item_id": item["id"],
                "quantity": new_quantity,
                "action": "updated"
            }
        else:
            result = supabase.table("cart").insert({
                "user_id": data.user_id,
                "product_id": data.product_id,
                "product_name": data.product_name,
                "product_price": data.product_price,
                "product_category": data.product_category,
                "product_image": data.product_image,
                "quantity": data.quantity,
                "created_at": now,
                "updated_at": now
            }).execute()

            inserted = result.data[0] if result.data else {}
            return {
                "message": "Item added to cart",
                "cart_item_id": inserted.get("id"),
                "quantity": data.quantity,
                "action": "added"
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding to cart: {str(e)}")


@router.put("/{cart_item_id}")
async def update_cart_item(cart_item_id: int, data: CartItemUpdate, current_user: dict = Depends(get_current_user)):
    try:
        existing = supabase.table("cart").select("*").eq("id", cart_item_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"Cart item {cart_item_id} not found")
        
        # Get user's email from JWT token
        user_email = current_user.get("sub")
        
        # Verify the cart item belongs to the current user
        if str(existing.data[0]["user_id"]) != str(user_email):
            raise HTTPException(status_code=403, detail="Access denied")

        now = datetime.now(timezone.utc).isoformat()
        supabase.table("cart").update({
            "quantity": data.quantity,
            "updated_at": now
        }).eq("id", cart_item_id).execute()

        return {"message": "Cart item updated", "cart_item_id": cart_item_id, "quantity": data.quantity}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating cart item: {str(e)}")


@router.delete("/{cart_item_id}")
async def delete_cart_item(cart_item_id: int, current_user: dict = Depends(get_current_user)):
    try:
        existing = supabase.table("cart").select("*").eq("id", cart_item_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"Cart item {cart_item_id} not found")
        
        # Get user's email from JWT token
        user_email = current_user.get("sub")
        
        # Verify the cart item belongs to the current user
        if str(existing.data[0]["user_id"]) != str(user_email):
            raise HTTPException(status_code=403, detail="Access denied")

        supabase.table("cart").delete().eq("id", cart_item_id).execute()
        return {"message": "Cart item deleted", "cart_item_id": cart_item_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting cart item: {str(e)}")


@router.delete("/user/{user_id}")
async def clear_user_cart(user_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Get user's email from JWT token
        user_email = current_user.get("sub")
        
        # Verify user is clearing their own cart
        if str(user_id) != str(user_email):
            raise HTTPException(status_code=403, detail="Access denied")
        
        result = supabase.table("cart").delete().eq("user_id", user_id).execute()
        return {"message": f"Cart cleared for user {user_id}", "items_deleted": len(result.data or [])}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cart: {str(e)}")


@router.get("/user/{user_id}/summary")
def get_cart_summary(user_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Get user's email from JWT token
        user_email = current_user.get("sub")
        
        # Verify user is accessing their own cart
        if str(user_id) != str(user_email):
            raise HTTPException(status_code=403, detail="Access denied")
        
        result = supabase.table("cart").select("*").eq("user_id", user_id).execute()
        items = result.data or []

        total_items = sum(i["quantity"] for i in items)
        total_price = sum(i["product_price"] * i["quantity"] for i in items)

        return {
            "user_id": user_id,
            "total_items": total_items,
            "total_price": total_price,
            "items_count": len(items),
            "items": items
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cart summary: {str(e)}")
