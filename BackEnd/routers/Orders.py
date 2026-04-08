from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from config.db import supabase
from Schemas.Orders import OrderCreate, OrderUpdate
from datetime import datetime, timezone

router = APIRouter()


@router.get("/")
def get_orders(
    status: Optional[str] = Query(None),
    customer_email: Optional[str] = Query(None)
):
    try:
        query = supabase.table("orders").select("*").order("order_date", desc=True)

        if status:
            query = query.eq("status", status)
        if customer_email:
            query = query.eq("customer_email", customer_email)

        result = query.execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


@router.get("/{order_id}")
def get_order(order_id: str):
    try:
        result = supabase.table("orders").select("*").eq("order_id", order_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")


@router.post("/")
async def create_order(data: OrderCreate):
    try:
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
async def update_order(order_id: str, data: OrderUpdate):
    try:
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
async def delete_order(order_id: str):
    try:
        existing = supabase.table("orders").select("id").eq("order_id", order_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

        supabase.table("orders").delete().eq("order_id", order_id).execute()
        return {"message": "Order deleted successfully", "order_id": order_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting order: {str(e)}")
