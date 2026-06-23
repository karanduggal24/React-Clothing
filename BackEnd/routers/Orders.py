from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from config.db import supabase
from Schemas.Orders import OrderCreate, OrderUpdate
from datetime import datetime, timezone
from utils.auth_dependency import get_current_user, get_current_admin

router = APIRouter()


@router.get("/")
def get_my_orders(
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Get orders for the current authenticated user
    Regular users see only their own orders
    """
    try:
        user_email = current_user.get("sub")
        print(f"[ORDERS DEBUG] User {user_email} fetching their own orders")
        
        query = supabase.table("orders").select("*").eq("customer_email", user_email).order("order_date", desc=True)

        if status:
            query = query.eq("status", status)

        result = query.execute()
        print(f"[ORDERS DEBUG] Found {len(result.data or [])} orders for user")
        return result.data or []
    except Exception as e:
        print(f"[ORDERS ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


@router.get("/admin/all")
def get_all_orders_admin(
    status: Optional[str] = Query(None),
    customer_email: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_admin)
):
    """
    Get ALL orders (Admin only)
    Can optionally filter by status or customer_email
    """
    try:
        print(f"[ORDERS DEBUG] Admin {current_user.get('sub')} fetching all orders")
        
        query = supabase.table("orders").select("*").order("order_date", desc=True)

        if customer_email:
            print(f"[ORDERS DEBUG] Admin filtering by customer_email: {customer_email}")
            query = query.eq("customer_email", customer_email)

        if status:
            query = query.eq("status", status)

        result = query.execute()
        print(f"[ORDERS DEBUG] Found {len(result.data or [])} total orders")
        return result.data or []
    except Exception as e:
        print(f"[ORDERS ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


@router.get("/{order_id}")
def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    try:
        result = supabase.table("orders").select("*").eq("order_id", order_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
        
        # Get user's email and role from JWT token
        user_email = current_user.get("sub")
        user_role = current_user.get("role")
        
        # Users can only access their own orders unless they're admin
        if user_role != "admin" and result.data["customer_email"] != user_email:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")


@router.post("/")
async def create_order(data: OrderCreate, current_user: dict = Depends(get_current_user)):
    try:
        # Get user's email from JWT token
        user_email = current_user.get("sub")
        
        # Verify the order is being created for the authenticated user
        if data.customer_email != user_email:
            raise HTTPException(status_code=403, detail="Cannot create order for another user")
        
        # Check if order_id already exists
        existing = supabase.table("orders").select("id").eq("order_id", data.order_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail=f"Order {data.order_id} already exists")

        now = datetime.now(timezone.utc).isoformat()
        result = supabase.table("orders").insert({
            "order_id": data.order_id,
            "customer_name": data.customer_name,
            "customer_email": data.customer_email,
            "customer_phone": data.customer_phone,
            "address": data.address,
            "city": data.city,
            "state": data.state,
            "pincode": data.pincode,
            "country": data.country,
            "order_items": data.order_items,
            "total_items": data.total_items,
            "total_price": data.total_price,
            "status": data.status,
            "order_date": now,
            "updated_at": now
        }).execute()

        inserted = result.data[0] if result.data else {}
        return {"message": "Order created successfully", "order_id": data.order_id, "id": inserted.get("id")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")


@router.patch("/{order_id}")
async def update_order(order_id: str, data: OrderUpdate, current_user: dict = Depends(get_current_admin)):
    try:
        # Only admins can update orders
        existing = supabase.table("orders").select("id").eq("order_id", order_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

        update_data = {}
        if data.status is not None:
            update_data["status"] = data.status
        if data.shipping_id is not None:
            update_data["shipping_id"] = data.shipping_id
        if data.shipping_company is not None:
            update_data["shipping_company"] = data.shipping_company

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        supabase.table("orders").update(update_data).eq("order_id", order_id).execute()

        return {"message": "Order updated successfully", "order_id": order_id, "updated_fields": list(update_data.keys())}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order: {str(e)}")


@router.delete("/{order_id}")
async def delete_order(order_id: str, current_user: dict = Depends(get_current_admin)):
    try:
        # Only admins can delete orders
        existing = supabase.table("orders").select("id").eq("order_id", order_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

        supabase.table("orders").delete().eq("order_id", order_id).execute()
        return {"message": "Order deleted successfully", "order_id": order_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting order: {str(e)}")
