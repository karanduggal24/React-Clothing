from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from models.Cart import cart
from config.db import conn
from Schemas.Cart import CartItem, CartItemUpdate

router = APIRouter()

@router.get("/")
def get_cart_items(user_id: Optional[str] = Query(None, description="Filter by user ID")):
    """
    Get all cart items, optionally filtered by user_id
    """
    try:
        if user_id:
            query = cart.select().where(cart.c.user_id == user_id)
        else:
            query = cart.select()
        
        result = conn.execute(query).fetchall()
        
        cart_items = []
        for row in result:
            cart_items.append({
                "id": row.id,
                "user_id": row.user_id,
                "product_id": row.product_id,
                "product_name": row.product_name,
                "product_price": row.product_price,
                "product_category": row.product_category,
                "product_image": row.product_image,
                "quantity": row.quantity,
                "created_at": row.created_at.isoformat() if row.created_at else None,
                "updated_at": row.updated_at.isoformat() if row.updated_at else None
            })
        
        return cart_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cart items: {str(e)}")


@router.get("/{cart_item_id}")
def get_cart_item(cart_item_id: int):
    """Get a single cart item by ID"""
    try:
        query = cart.select().where(cart.c.id == cart_item_id)
        result = conn.execute(query).fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Cart item with ID {cart_item_id} not found")
        
        return {
            "id": result.id,
            "user_id": result.user_id,
            "product_id": result.product_id,
            "product_name": result.product_name,
            "product_price": result.product_price,
            "product_category": result.product_category,
            "product_image": result.product_image,
            "quantity": result.quantity,
            "created_at": result.created_at.isoformat() if result.created_at else None,
            "updated_at": result.updated_at.isoformat() if result.updated_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cart item: {str(e)}")


@router.post("/")
async def add_to_cart(data: CartItem):
    """
    Add item to cart or update quantity if already exists
    """
    try:
        # Check if item already exists in cart for this user
        check_query = cart.select().where(
            (cart.c.user_id == data.user_id) & 
            (cart.c.product_id == data.product_id)
        )
        existing = conn.execute(check_query).fetchone()
        
        if existing:
            # Update quantity if item already exists
            from datetime import datetime
            new_quantity = existing.quantity + data.quantity
            update_query = cart.update().where(cart.c.id == existing.id).values(
                quantity=new_quantity,
                updated_at=datetime.now()
            )
            conn.execute(update_query)
    
            
            return {
                "message": "Cart item quantity updated",
                "cart_item_id": existing.id,
                "quantity": new_quantity,
                "action": "updated"
            }
        else:
            # Add new item to cart
            from datetime import datetime
            now = datetime.now()
            result = conn.execute(cart.insert().values(
                user_id=data.user_id,
                product_id=data.product_id,
                product_name=data.product_name,
                product_price=data.product_price,
                product_category=data.product_category,
                product_image=data.product_image,
                quantity=data.quantity,
                created_at=now,
                updated_at=now
            ))
    
            
            return {
                "message": "Item added to cart successfully",
                "cart_item_id": result.lastrowid,
                "quantity": data.quantity,
                "action": "added"
            }
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error adding to cart: {str(e)}")


@router.put("/{cart_item_id}")
async def update_cart_item(cart_item_id: int, data: CartItemUpdate):
    """Update cart item quantity"""
    try:
        # Check if cart item exists
        check_query = cart.select().where(cart.c.id == cart_item_id)
        existing = conn.execute(check_query).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail=f"Cart item with ID {cart_item_id} not found")
        
        # Update quantity
        from datetime import datetime
        update_query = cart.update().where(cart.c.id == cart_item_id).values(
            quantity=data.quantity,
            updated_at=datetime.now()
        )
        conn.execute(update_query)

        
        return {
            "message": "Cart item updated successfully",
            "cart_item_id": cart_item_id,
            "quantity": data.quantity
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error updating cart item: {str(e)}")


@router.delete("/{cart_item_id}")
async def delete_cart_item(cart_item_id: int):
    """Delete a cart item"""
    try:
        # Check if cart item exists
        check_query = cart.select().where(cart.c.id == cart_item_id)
        existing = conn.execute(check_query).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail=f"Cart item with ID {cart_item_id} not found")
        
        # Delete cart item
        delete_query = cart.delete().where(cart.c.id == cart_item_id)
        conn.execute(delete_query)

        
        return {
            "message": "Cart item deleted successfully",
            "cart_item_id": cart_item_id
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error deleting cart item: {str(e)}")


@router.delete("/user/{user_id}")
async def clear_user_cart(user_id: str):
    """Clear all cart items for a specific user"""
    try:
        delete_query = cart.delete().where(cart.c.user_id == user_id)
        result = conn.execute(delete_query)

        
        return {
            "message": f"Cart cleared for user {user_id}",
            "items_deleted": result.rowcount
        }
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error clearing cart: {str(e)}")


@router.get("/user/{user_id}/summary")
def get_cart_summary(user_id: str):
    """Get cart summary for a user (total items, total price)"""
    try:
        query = cart.select().where(cart.c.user_id == user_id)
        result = conn.execute(query).fetchall()
        
        total_items = 0
        total_price = 0
        items = []
        
        for row in result:
            total_items += row.quantity
            total_price += row.product_price * row.quantity
            items.append({
                "id": row.id,
                "product_id": row.product_id,
                "product_name": row.product_name,
                "product_price": row.product_price,
                "quantity": row.quantity,
                "subtotal": row.product_price * row.quantity
            })
        
        return {
            "user_id": user_id,
            "total_items": total_items,
            "total_price": total_price,
            "items_count": len(items),
            "items": items
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cart summary: {str(e)}")
